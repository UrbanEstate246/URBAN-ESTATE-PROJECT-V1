import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/app/utils/supabase";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, phoneNumber, password, email, county } = body;
        const verifiedEmail = String(email || req.cookies.get("verifiedEmail")?.value || "").trim().toLowerCase();
        // Only these two roles can be self-assigned; never trust e.g. "admin" from the client.
        const role = body.role === "agent" ? "agent" : "user";

        if (!name || !phoneNumber || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        if (String(password).length < 8) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verifiedEmail)) {
            return NextResponse.json(
                { success: false, message: "Valid email is required" },
                { status: 400 }
            );
        }

        // Register user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: verifiedEmail,
            password: password,
            email_confirm: true,
            user_metadata: {
                name,
                role,
                phone: phoneNumber,
                county: county || null
            }
        });

        if (authError) {
            const alreadyExists = /already.*registered|already exists/i.test(authError.message);
            return NextResponse.json(
                {
                    success: false,
                    message: alreadyExists
                        ? "An account with this email already exists."
                        : authError.message
                },
                { status: 400 }
            );
        }

        // Insert into public.users
        const { error: profileError } = await supabaseAdmin.from("users").upsert({
            id: authData.user.id,
            phone: phoneNumber,
            role: role === "agent" ? "agent" : "tenant",
            verification_level: 1,
            trust_score: 50,
            status: "active"
        });
        if (profileError) console.error("Profile upsert error:", profileError.message);

        // Sign in to generate valid JWT session token
        const { data: loginData } = await supabase.auth.signInWithPassword({
            email: verifiedEmail,
            password
        });

        const token = loginData?.session?.access_token || "";

        const response = NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: {
                    id: authData.user.id,
                    name,
                    email: verifiedEmail,
                    // Matches what UserLogin returns from public.users
                    role: role === "agent" ? "agent" : "tenant"
                },
                token,
            },
            { status: 200 }
        );

        if (token) {
            response.cookies.set("token", token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
            });
        }

        response.cookies.delete("verifiedEmail");
        return response;

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Error while creating user" },
            { status: 500 }
        );
    }
}
