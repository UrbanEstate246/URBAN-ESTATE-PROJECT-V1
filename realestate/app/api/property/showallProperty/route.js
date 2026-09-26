import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { formatProperty } from "@/app/utils/property";

export async function GET() {
    try {
        const { data: properties, error } = await supabaseAdmin
            .from("properties")
            .select(`
                *,
                property_images(*),
                owner:users!owner_id(*)
            `)
            .eq("status", "active")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error fetching properties:", error);
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 });
        }

        const formatted = (properties || []).map(formatProperty);

        return NextResponse.json({
            success: true,
            properties: formatted,
            message: "Fetched successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching properties"
        }, { status: 500 });
    }
}
