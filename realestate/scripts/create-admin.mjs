// Creates (or resets) the UrbanEstate admin account.
//
//   node --env-file=.env scripts/create-admin.mjs [email] [name] [phone]
//
// Defaults to ann@urbanestate.co.ke. Set ADMIN_PASSWORD to choose the temporary password;
// otherwise a random one is generated and printed ONCE. Share it privately, then have the admin
// change it from the Admin page ("Change your password").
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const [email = "ann@urbanestate.co.ke", name = "Ann", phone = "0119524364"] = process.argv.slice(2);
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const generated = !process.env.ADMIN_PASSWORD;
const password = process.env.ADMIN_PASSWORD || `${randomBytes(9).toString("base64url")}!9a`;
const metadata = { name, role: "admin", phone };

async function findUser() {
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match || data.users.length < 1000) return match;
  }
}

let user = await findUser();
if (user) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    user_metadata: { ...user.user_metadata, ...metadata },
  });
  if (error) throw error;
  user = data.user;
  console.log(`Updated existing account ${email}.`);
} else {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (error) throw error;
  user = data.user;
  console.log(`Created account ${email}.`);
}

const { error: profileError } = await supabaseAdmin.from("users").upsert({
  id: user.id,
  phone,
  role: "admin",
  verification_level: 3,
  trust_score: 100,
  status: "active",
});
if (profileError) throw profileError;

console.log(`${email} is now an admin.`);
console.log(generated ? `Temporary password (shown once): ${password}` : "Password set from ADMIN_PASSWORD.");
