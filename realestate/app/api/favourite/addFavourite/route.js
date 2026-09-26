import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function POST(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const propertiesId = searchParams.get("pid");

        if (!propertiesId) {
            return NextResponse.json(
                { success: false, message: "Property ID is missing in URL" },
                { status: 400 }
            );
        }

        const { data: savedFavorite, error } = await supabaseAdmin
            .from("favorites")
            .upsert({
                user_id: user.id,
                property_id: propertiesId
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Added to favorites",
            favourite: savedFavorite
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error adding to favorites",
            error: error.message
        }, { status: 500 });
    }
}
