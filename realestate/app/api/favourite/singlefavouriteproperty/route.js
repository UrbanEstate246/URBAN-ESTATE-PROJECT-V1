import { supabaseAdmin } from "@/app/utils/supabase";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/app/utils/auth";

export async function GET(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        const FavouriteId = searchParams.get("fid");

        if (!FavouriteId) {
            return NextResponse.json({
                success: false,
                message: "Favouriteid is required"
            }, { status: 400 });
        }

        const { data: fav, error } = await supabaseAdmin
            .from("favorites")
            .select(`
                id,
                user_id,
                property_id,
                created_at,
                properties (*)
            `)
            .eq("id", FavouriteId)
            .eq("user_id", user.id)
            .single();

        if (error || !fav) {
            return NextResponse.json({
                success: false,
                message: "Favorite property not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Successfully found Property",
            FavoritesProperty: {
                _id: fav.id,
                property: fav.properties,
                User: { id: fav.user_id }
            }
        });
    } catch (error) {
        console.error("singlefavouriteproperty error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Error retrieving favorite property"
        }, { status: 500 });
    }
}
