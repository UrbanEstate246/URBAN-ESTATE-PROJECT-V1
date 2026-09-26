import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function DELETE(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        const BookingId = searchParams.get("bid");

        if (!BookingId) {
            return NextResponse.json(
                { success: false, message: "BookingId missing in URL (bid)" },
                { status: 400 }
            );
        }

        const { data: booking } = await supabaseAdmin
            .from("bookings").select("user_id, property:properties(owner_id)").eq("id", BookingId).maybeSingle();
        if (!booking) return NextResponse.json({ success: false, message: "Viewing request not found" }, { status: 404 });
        if (booking.user_id !== user.id && booking.property?.owner_id !== user.id && user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You cannot delete this viewing request" }, { status: 403 });
        }

        const { error } = await supabaseAdmin
            .from("bookings")
            .delete()
            .eq("id", BookingId);

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Successfully deleted"
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error deleting booking",
        }, { status: 500 });
    }
}
