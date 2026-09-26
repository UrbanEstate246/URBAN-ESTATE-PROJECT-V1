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
            .eq("user_id", user.id);

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
            property: b.property ? {
                ...b.property,
                _id: b.property.id,
                images: b.property.property_images?.map(i => i.cloudinary_url) || []
            } : null
        }));

        return NextResponse.json({
            success: true,
            data: formatted,
            message: "Fetched successfully",
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error fetching bookings"
        }, { status: 500 });
    }
}
