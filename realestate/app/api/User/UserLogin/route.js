import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/app/utils/supabase";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Email or password is missing"
            }, { status: 400 });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data.user) {
            return NextResponse.json({
                success: false,
                message: error?.message || "Invalid credentials"
            }, { status: 401 });
        }

        // Fetch user profile from public.users table
        const { data: userProfile } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

        const role = userProfile?.role || data.user.user_metadata?.role || "user";
        const name = data.user.user_metadata?.name || data.user.email.split("@")[0];

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            token: data.session.access_token,
            user: {
                id: data.user.id,
                name: name,
                email: data.user.email,
                role: role
            }
        });

        response.cookies.set("token", data.session.access_token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({
            success: false,
            message: "Server error occurred during login"
        }, { status: 500 });
    }
}
