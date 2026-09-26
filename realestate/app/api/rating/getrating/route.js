import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const AgentId = searchParams.get("aid");

        let query = supabaseAdmin.from("ratings").select("*");
        if (AgentId) {
            query = query.eq("agent_id", AgentId);
        }

        const { data: ratings, error } = await query;

        if (error) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 });
        }

        const formatted = (ratings || []).map(r => ({
            _id: r.id,
            id: r.id,
            rating: Number(r.rating),
            user: { name: "Client", email: "client@urbanestate.co.ke" }
        }));

        return NextResponse.json(
            {
                success: true,
                message: "Ratings fetched successfully",
                ratings: formatted,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Error retrieving ratings",
            },
            { status: 500 }
        );
    }
}
