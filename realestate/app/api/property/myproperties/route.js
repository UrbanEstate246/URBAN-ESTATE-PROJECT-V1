import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";
import { formatProperty } from "@/app/utils/property";

export async function GET(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Please sign in" },
                { status: 401 }
            );
        }

        const { data: properties, error } = await supabaseAdmin
            .from("properties")
            .select(`
                *,
                property_images(*),
                owner:users!owner_id(*)
            `)
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        const formatted = (properties || []).map((p) => formatProperty(p, { includeContact: true }));

        return NextResponse.json(
            { success: true, properties: formatted },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error fetching properties", error: error.message },
            { status: 500 }
        );
    }
}
