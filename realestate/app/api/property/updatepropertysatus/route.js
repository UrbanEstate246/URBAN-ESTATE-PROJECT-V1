import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

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
        if (property.owner_id !== user.id && user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You cannot update this property" }, { status: 403 });
        }

        const { status: newStatus } = await req.json();
        if (!newStatus) {
            return NextResponse.json(
                { success: false, message: "New status is required" },
                { status: 400 }
            );
        }

        const dbStatus = newStatus === "available" ? "active" : newStatus;

        const { data: updatedProperty, error } = await supabaseAdmin
            .from("properties")
            .update({ status: dbStatus })
            .eq("id", propertiesId)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Status updated successfully", updatedProperty },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error updating status", error: error.message },
            { status: 500 }
        );
    }
}
