import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function GET(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });

        const { data: bookings, error } = await supabaseAdmin
            .from("bookings")
            .select(`
                *,
                property:properties(*, property_images(*))
            `)
            .eq("property.owner_id", user.id)
            .not("property", "is", null);

        if (error) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 });
        }

        const formatted = (bookings || []).map(b => ({
            _id: b.id,
            id: b.id,
            VisitDate: b.visit_date,
            status: b.status,
            user: { id: b.user_id, name: "Prospective Tenant / Buyer" },
            property: b.property ? {
                ...b.property,
                _id: b.property.id,
                images: b.property.property_images?.map(i => i.cloudinary_url) || []
            } : null
        }));

        return NextResponse.json({
            success: true,
            message: "Agent bookings fetched successfully",
            data: formatted
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error fetching agent bookings"
        }, { status: 500 });
    }
}
