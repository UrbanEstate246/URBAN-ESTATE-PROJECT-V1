import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabaseAdmin } from "@/app/utils/supabase";
import { getAuthUser } from "@/app/utils/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGES = 10;

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });

    const formData = await req.formData();
    const imageFiles = formData.getAll("images").filter((file) => file && typeof file !== "string" && file.size);
    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json({ success: false, message: "Upload no more than 10 images." }, { status: 400 });
    }
    const invalidImage = imageFiles.find((file) => !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE);
    if (invalidImage) {
      return NextResponse.json({ success: false, message: "Each image must be JPEG, PNG or WebP and no larger than 8 MB." }, { status: 400 });
    }

    const { data: authData } = await supabaseAdmin.auth.admin.getUserById(user.id);
    const metadata = authData?.user?.user_metadata || {};
    const profileRole = metadata.role === "agent" ? "agent" : "landlord";
    const { error: profileError } = await supabaseAdmin.from("users").upsert({
      id: user.id,
      phone: metadata.phone || null,
      role: profileRole,
      status: "active",
    }, { onConflict: "id", ignoreDuplicates: true });
    if (profileError) throw profileError;

    const uploadedImages = [];
    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString("base64")}`, {
        folder: "URBAN ESTATE",
        transformation: [{
          overlay: { font_family: "Arial", font_size: 24, font_weight: "bold", text: "Posted on URBAN ESTATE" },
          color: "#FFFFFF", gravity: "south_east", x: 15, y: 15,
        }],
      });
      uploadedImages.push({ url: uploadRes.secure_url, public_id: uploadRes.public_id });
    }

    const categoryInput = String(formData.get("category") || "rent").toLowerCase();
    const category = ["rent", "sale", "land"].includes(categoryInput) ? categoryInput : "rent";
    const amenities = formData.getAll("amenities").map(String);
    const { data: newProperty, error: propError } = await supabaseAdmin.from("properties").insert({
      owner_id: user.id,
      title: String(formData.get("title") || "").trim(),
      description: [formData.get("description"), formData.get("moredetails")].filter(Boolean).join("\n\n"),
      price: Number(formData.get("price")) || 0,
      type: String(formData.get("type") || "Bedsitter"),
      category,
      county: String(formData.get("state") || "").trim(),
      area: String(formData.get("city") || "").trim(),
      ward: String(formData.get("address") || "").trim(),
      bedrooms: category === "land" ? null : Number(formData.get("bedrooms")) || null,
      bathrooms: category === "land" ? null : Number(formData.get("bathrooms")) || null,
      status: "active",
      verification_status: "pending",
      amenities,
    }).select().single();

    if (propError) return NextResponse.json({ success: false, message: propError.message }, { status: 500 });

    if (uploadedImages.length) {
      const { error: imageError } = await supabaseAdmin.from("property_images").insert(uploadedImages.map((image, index) => ({
        property_id: newProperty.id,
        cloudinary_public_id: image.public_id,
        cloudinary_url: image.url,
        thumbnail_url: image.url,
        display_order: index,
      })));
      if (imageError) throw imageError;
    }

    return NextResponse.json({ success: true, message: "Property created successfully!", newProperty: { ...newProperty, _id: newProperty.id, images: uploadedImages.map((image) => image.url) } });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json({ success: false, message: "Could not create the property" }, { status: 500 });
  }
}
