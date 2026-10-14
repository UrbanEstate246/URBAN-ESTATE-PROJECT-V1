import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

// Lets a signed-in user replace their password (e.g. swap the temporary one an admin was given).
export async function POST(req) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });

        const { newPassword } = await req.json();
        if (String(newPassword || "").length < 8) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password: String(newPassword) });
        if (error) return NextResponse.json({ success: false, message: error.message }, { status: 400 });

        return NextResponse.json({ success: true, message: "Password updated" }, { status: 200 });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json({ success: false, message: "Could not update password" }, { status: 500 });
    }
}
