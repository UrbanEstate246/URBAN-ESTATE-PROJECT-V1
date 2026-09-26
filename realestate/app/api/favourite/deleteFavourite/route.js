import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function DELETE(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const propertyId = searchParams.get("pid");

        if (!propertyId) {
            return NextResponse.json(
                { success: false, message: "propertyId is missing" },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("favorites")
            .delete()
            .match({ user_id: user.id, property_id: propertyId });

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { success: true, message: "Deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error deleting favourite",
        }, { status: 500 });
    }
}
