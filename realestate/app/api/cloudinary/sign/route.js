import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAuthUser } from "@/app/utils/auth";
import { UPLOAD_FOLDER, ALLOWED_FORMATS } from "@/app/utils/cloudinaryAssets";

// Hands a signed-in user a short-lived signature so the browser can upload a photo
// straight to Cloudinary. Photos never pass through Netlify (6 MB / 10 s function limits),
// and the API secret never leaves the server.
export async function POST(req) {
    const user = await getAuthUser(req);
    if (!user) {
        return NextResponse.json({ success: false, message: "Please sign in" }, { status: 401 });
    }

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return NextResponse.json({ success: false, message: "Image uploads are not configured" }, { status: 500 });
    }

    // Every signed param must be sent back by the browser unchanged, or Cloudinary rejects the upload.
    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder: UPLOAD_FOLDER, allowed_formats: ALLOWED_FORMATS };
    const signature = cloudinary.utils.api_sign_request(params, CLOUDINARY_API_SECRET);

    return NextResponse.json({
        success: true,
        ...params,
        signature,
        apiKey: CLOUDINARY_API_KEY,
        cloudName: CLOUDINARY_CLOUD_NAME,
    });
}
