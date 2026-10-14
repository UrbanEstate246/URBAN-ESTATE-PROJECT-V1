import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";
import { formatProperty } from "@/app/utils/property";

// Every listing in every state, for the admin moderation page. Admins only.
export async function GET(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
        if (user.role !== "admin") return NextResponse.json({ success: false, message: "Admins only" }, { status: 403 });

        const { data, error } = await supabaseAdmin
            .from("properties")
            .select("*, property_images(*), owner:users!owner_id(*)")
            .order("created_at", { ascending: false });

        if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

        const properties = (data || []).map((p) => formatProperty(p, { includeContact: true }));
        return NextResponse.json({ success: true, properties }, { status: 200 });
    } catch (error) {
        console.error("Admin properties error:", error);
        return NextResponse.json({ success: false, message: "Error fetching listings" }, { status: 500 });
    }
}
