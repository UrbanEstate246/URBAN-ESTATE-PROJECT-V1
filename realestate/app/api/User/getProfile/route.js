import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

export async function GET(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
        const UserId = user.id;

        const { data: userProfile, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", UserId)
            .single();

        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(UserId);

        const profile = {
            _id: UserId,
            id: UserId,
            name: authUser?.user?.user_metadata?.name || "UrbanEstate User",
            email: authUser?.user?.email || "",
            phoneNumber: userProfile?.phone || authUser?.user?.user_metadata?.phone || "",
            role: userProfile?.role || "user",
            ...userProfile
        };

        return NextResponse.json({
            success: true,
            message: "Profile retrieved successfully",
            userProfile: profile
        }, { status: 200 });

    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching user profile"
        }, { status: 500 });
    }
}
