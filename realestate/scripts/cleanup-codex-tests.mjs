import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

const users = [];
for (let page = 1; ; page += 1) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) throw error;
  const matches = data.users.filter((user) => /^codex-te(?:st)?\+\d+@example\.com$/i.test(user.email || ""));
  users.push(...matches);
  if (data.users.length < 1000) break;
}

for (const user of users) {
  await supabaseAdmin.from("favorites").delete().eq("user_id", user.id);
  await supabaseAdmin.from("bookings").delete().eq("user_id", user.id);
  const { data: properties } = await supabaseAdmin.from("properties").select("id, property_images(cloudinary_public_id)").eq("owner_id", user.id);
  for (const property of properties || []) {
    for (const image of property.property_images || []) {
      if (image.cloudinary_public_id) await cloudinary.uploader.destroy(image.cloudinary_public_id);
    }
    await supabaseAdmin.from("property_images").delete().eq("property_id", property.id);
    await supabaseAdmin.from("properties").delete().eq("id", property.id);
  }
  await supabaseAdmin.from("users").delete().eq("id", user.id);
  await supabaseAdmin.auth.admin.deleteUser(user.id);
}

console.log(`Deleted ${users.length} Codex test user(s) and their listing data.`);
