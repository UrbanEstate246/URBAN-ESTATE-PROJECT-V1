import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function PUT(req) {
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
            .from("bookings").select("property:properties(owner_id)").eq("id", BookingId).maybeSingle();
        if (!booking) return NextResponse.json({ success: false, message: "Viewing request not found" }, { status: 404 });
        if (booking.property?.owner_id !== user.id && user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You cannot update this viewing request" }, { status: 403 });
        }

        const { status: newStatus } = await req.json();
        if (!["pending", "accepted", "rejected", "cancelled"].includes(newStatus)) {
            return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
        }

        const { data: updatedBooking, error } = await supabaseAdmin
            .from("bookings")
            .update({ status: newStatus })
            .eq("id", BookingId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Successful booking status update",
            updatedBooking: {
                ...updatedBooking,
                _id: updatedBooking.id,
                VisitDate: updatedBooking.visit_date
            }
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error updating booking status"
        }, { status: 500 });
    }
}
