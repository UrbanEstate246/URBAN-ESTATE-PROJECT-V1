import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function POST(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        const AgentId = searchParams.get("aid");

        if (!AgentId) return NextResponse.json({ success: false, message: "Agent id is required" }, { status: 400 });

        const { rating, review } = await req.json();
        if (rating > 5 || rating < 1) {
            return NextResponse.json({
                success: false,
                message: "Please provide a rating between 1 and 5"
            }, { status: 400 });
        }

        const { data: newRating, error } = await supabaseAdmin
            .from("ratings")
            .insert({
                user_id: user.id,
                agent_id: AgentId,
                rating: Number(rating),
                review: review || "Great experience!"
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Rating added successfully",
                rating: newRating,
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error adding rating"
        }, { status: 500 });
    }
}
