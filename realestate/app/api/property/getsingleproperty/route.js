import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { formatProperty } from "@/app/utils/property";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const propertiesId = searchParams.get("pid");

        if (!propertiesId) {
            return NextResponse.json({
                success: false,
                message: "propertyid is missing"
            }, { status: 400 });
        }

        const { data: p, error } = await supabaseAdmin
            .from("properties")
            .select(`
                *,
                property_images(*),
                owner:users!owner_id(*)
            `)
            .eq("id", propertiesId)
            .single();

        if (error || !p) {
            return NextResponse.json({
                success: false,
                message: "property not found"
            }, { status: 404 });
        }

        const formatted = formatProperty(p);

        return NextResponse.json({
            success: true,
            message: "property found",
            property: formatted
        }, { status: 200 });
    } catch (error) {
        console.error("Single property error:", error);
        return NextResponse.json({
            success: false,
            message: "Error getting single property"
        }, { status: 500 });
    }
}
