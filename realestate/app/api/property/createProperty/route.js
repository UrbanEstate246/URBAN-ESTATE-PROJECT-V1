import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";
import { destroyPhotos, toPropertyImages } from "@/app/utils/cloudinaryAssets";
import { normalizeKenyanPhone } from "@/app/utils/phone";

// True when the database has not had the contact_phone/contact_name migration applied yet.
const isMissingContactColumn = (error) => /contact_(phone|name)/i.test(error?.message || "");

// Photos are uploaded by the browser straight to Cloudinary (see app/utils/uploadPhoto.js);
// this route only receives small JSON: the form fields plus [{ public_id, version }].
export async function POST(req) {
  let publicIds = [];
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    let imageRows;
    try {
      imageRows = toPropertyImages(body.photos);
    } catch (err) {
      return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    }
    publicIds = imageRows.map((row) => row.cloudinary_public_id);

    const title = String(body.title || "").trim();
    const county = String(body.state || "").trim();
    const area = String(body.city || "").trim();
    const price = Number(body.price);
    if (!title || !county || !area || !(price > 0)) {
      return NextResponse.json({ success: false, message: "Add a title, county, town and price." }, { status: 400 });
    }

    const { data: authData } = await supabaseAdmin.auth.admin.getUserById(user.id);
    const metadata = authData?.user?.user_metadata || {};

    // Buyers call this number directly. Use the number typed on the form, else the owner's signup number.
    const typedPhone = String(body.contactPhone || "").trim();
    const contactPhone = typedPhone ? normalizeKenyanPhone(typedPhone) : normalizeKenyanPhone(metadata.phone);
    if (!contactPhone) {
      return NextResponse.json({
        success: false,
        message: "Add a valid Kenyan phone number buyers can call, e.g. 0712 345 678.",
      }, { status: 400 });
    }
    const contactName = String(body.contactName || metadata.name || "").trim().slice(0, 100) || null;

    const { error: profileError } = await supabaseAdmin.from("users").upsert({
      id: user.id,
      phone: metadata.phone || null,
      role: metadata.role === "agent" ? "agent" : "landlord",
      status: "active",
    }, { onConflict: "id", ignoreDuplicates: true });
    if (profileError) throw profileError;

    const categoryInput = String(body.category || "rent").toLowerCase();
    const category = ["rent", "sale", "land"].includes(categoryInput) ? categoryInput : "rent";
    const amenities = Array.isArray(body.amenities) ? body.amenities.map(String).slice(0, 20) : [];

    const row = {
      owner_id: user.id,
      title: title.slice(0, 200),
      description: [body.description, body.moredetails].filter(Boolean).map(String).join("\n\n"),
      price,
      type: String(body.type || "Bedsitter"),
      category,
      county,
      area,
      ward: String(body.address || "").trim(),
      bedrooms: category === "land" ? null : Number(body.bedrooms) || null,
      bathrooms: category === "land" ? null : Number(body.bathrooms) || null,
      status: "active",
      verification_status: "pending",
      amenities,
    };

    let { data: newProperty, error: propError } = await supabaseAdmin
      .from("properties")
      .insert({ ...row, contact_phone: contactPhone, contact_name: contactName })
      .select().single();
    if (propError && isMissingContactColumn(propError)) {
      // Migration 20250101000009 not applied yet: still publish; the owner's profile phone is shown instead.
      ({ data: newProperty, error: propError } = await supabaseAdmin.from("properties").insert(row).select().single());
    }
    if (propError) throw propError;

    const { error: imageError } = await supabaseAdmin
      .from("property_images")
      .insert(imageRows.map((row) => ({ ...row, property_id: newProperty.id })));
    if (imageError) {
      await supabaseAdmin.from("properties").delete().eq("id", newProperty.id);
      throw imageError;
    }

    return NextResponse.json({
      success: true,
      message: "Property created successfully!",
      newProperty: { ...newProperty, _id: newProperty.id, images: imageRows.map((row) => row.cloudinary_url) },
    });
  } catch (error) {
    console.error("Create property error:", error);
    await destroyPhotos(publicIds);
    return NextResponse.json({ success: false, message: "Could not create the property. Please try again." }, { status: 500 });
  }
}
