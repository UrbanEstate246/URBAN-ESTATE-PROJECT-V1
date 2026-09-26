import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function POST(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
        const body = await req.json();
        const { VisitDate, visitDate, status } = body;
        const bookingDate = VisitDate || visitDate || new Date().toISOString();

        const { searchParams } = new URL(req.url);
        const PropertyId = searchParams.get("pid") || body.propertyId;

        if (!PropertyId) {
            return NextResponse.json(
                { success: false, message: "Property ID missing (pid)" },
                { status: 400 }
            );
        }

        const { data: booking, error } = await supabaseAdmin
            .from("bookings")
            .insert({
                user_id: user.id,
                property_id: PropertyId,
                visit_date: new Date(bookingDate).toISOString(),
                status: status || "pending"
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Booking successful!",
            booking: {
                ...booking,
                _id: booking.id,
                VisitDate: booking.visit_date
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({
            success: false,
            message: "Booking error occurred",
            error: error.message
        }, { status: 500 });
    }
}
