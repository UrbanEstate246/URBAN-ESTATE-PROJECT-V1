import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";
import { normalizeKenyanPhone } from "@/app/utils/phone";

// The database only accepts these listing states, so only these can be requested.
const STATUS_TO_DB = { available: "active", hidden: "hidden" };
const ADMIN_ONLY_STATUS = ["suspended", "pending", "deleted"];
const VERIFICATION = ["unverified", "pending", "verified", "rejected"];

export async function PUT(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        const propertiesId = searchParams.get("pid");

        if (!propertiesId) {
            return NextResponse.json(
                { success: false, message: "Property id (pid) required" },
                { status: 400 }
            );
        }

        const { data: property } = await supabaseAdmin
            .from("properties").select("owner_id").eq("id", propertiesId).maybeSingle();
        if (!property) return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
        const isAdmin = user.role === "admin";
        if (property.owner_id !== user.id && !isAdmin) {
            return NextResponse.json({ success: false, message: "You cannot update this property" }, { status: 403 });
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
        }

        const updates = {};

        if (body.title !== undefined) {
            const title = String(body.title).trim();
            if (!title) return NextResponse.json({ success: false, message: "Title cannot be empty" }, { status: 400 });
            updates.title = title.slice(0, 200);
        }

        if (body.description !== undefined) updates.description = String(body.description);

        if (body.price !== undefined && body.price !== "") {
            const price = Number(body.price);
            if (!(price > 0)) return NextResponse.json({ success: false, message: "Enter a price above zero" }, { status: 400 });
            updates.price = price;
        }

        if (body.contactPhone !== undefined) {
            const phone = normalizeKenyanPhone(body.contactPhone);
            if (!phone) {
                return NextResponse.json({
                    success: false,
                    message: "Enter a valid Kenyan phone number, e.g. 0712 345 678.",
                }, { status: 400 });
            }
            updates.contact_phone = phone;
        }
        if (body.contactName !== undefined) updates.contact_name = String(body.contactName).trim().slice(0, 100) || null;

        if (body.status !== undefined) {
            const requested = String(body.status);
            if (STATUS_TO_DB[requested]) updates.status = STATUS_TO_DB[requested];
            else if (isAdmin && ADMIN_ONLY_STATUS.includes(requested)) updates.status = requested;
            else return NextResponse.json({ success: false, message: "Status must be available or hidden" }, { status: 400 });
        }

        if (body.verificationStatus !== undefined) {
            if (!isAdmin) return NextResponse.json({ success: false, message: "Only admins can verify listings" }, { status: 403 });
            if (!VERIFICATION.includes(body.verificationStatus)) {
                return NextResponse.json({ success: false, message: "Invalid verification status" }, { status: 400 });
            }
            updates.verification_status = body.verificationStatus;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ success: false, message: "Nothing to update" }, { status: 400 });
        }

        const { data: updatedProperty, error } = await supabaseAdmin
            .from("properties")
            .update(updates)
            .eq("id", propertiesId)
            .select()
            .single();

        if (error) {
            const migrationPending = /contact_(phone|name)/i.test(error.message || "");
            return NextResponse.json(
                {
                    success: false,
                    message: migrationPending
                        ? "Contact numbers can't be changed until the database update is applied."
                        : error.message,
                },
                { status: migrationPending ? 409 : 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Listing updated", updatedProperty },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error updating listing", error: error.message },
            { status: 500 }
        );
    }
}
