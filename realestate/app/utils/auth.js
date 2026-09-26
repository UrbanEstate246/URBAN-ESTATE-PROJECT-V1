import { supabaseAdmin } from "@/app/utils/supabase";

export async function getAuthUser(req) {
  const authorization = req.headers.get("authorization") || "";
  const bearer = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = bearer || req.cookies.get("token")?.value;

  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    id: data.user.id,
    email: data.user.email || "",
    role: profile?.role || data.user.user_metadata?.role || "tenant",
  };
}
