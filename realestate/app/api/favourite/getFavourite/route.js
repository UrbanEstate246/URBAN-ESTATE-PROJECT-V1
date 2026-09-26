import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function GET(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });

        const { data: favorites, error } = await supabaseAdmin
            .from("favorites")
            .select(`
                *,
                property:properties(*, property_images(*))
            `)
            .eq("user_id", user.id);

        if (error) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 });
        }

        const formatted = (favorites || []).map(f => ({
            _id: f.id,
            id: f.id,
            User: { id: f.user_id },
            property: f.property ? {
                ...f.property,
                _id: f.property.id,
                images: f.property.property_images?.map(i => i.cloudinary_url) || []
            } : null
        })).filter(f => f.property !== null);

        return NextResponse.json({
            success: true,
            message: "Favorites fetched successfully",
            favouriteProperty: formatted
        }, { status: 200 });

    } catch (error) {
        console.error("Get favourites error:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching favorites"
        }, { status: 500 });
    }
}
