// Server-side helpers for property photos that the browser uploaded directly to Cloudinary.
import { v2 as cloudinary } from "cloudinary";

export const UPLOAD_FOLDER = "URBAN ESTATE";
export const ALLOWED_FORMATS = "jpg,jpeg,png,webp";
export const MAX_PHOTOS = 10;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Watermark is applied when the image is served, so the stored original stays clean.
const WATERMARK = [
    {
        overlay: { font_family: "Arial", font_size: 24, font_weight: "bold", text: "Posted on URBAN ESTATE" },
        color: "#FFFFFF",
        gravity: "south_east",
        x: 15,
        y: 15,
    },
    { quality: "auto", fetch_format: "auto" },
];

/**
 * Validates photos posted by the client ([{ public_id, version }]) and returns
 * rows ready for `property_images`. Only files inside our upload folder are accepted,
 * so a client cannot attach arbitrary external URLs to a listing.
 * Throws an Error with a user-facing message when the input is invalid.
 */
export function toPropertyImages(photos) {
    if (!Array.isArray(photos) || photos.length === 0) {
        throw new Error("Add at least one photo of the property.");
    }
    if (photos.length > MAX_PHOTOS) {
        throw new Error(`You can add up to ${MAX_PHOTOS} photos.`);
    }

    return photos.map((photo, index) => {
        const publicId = String(photo?.public_id || "");
        const version = photo?.version ? String(photo.version) : undefined;
        if (!publicId.startsWith(`${UPLOAD_FOLDER}/`) || publicId.includes("..") || (version && !/^\d+$/.test(version))) {
            throw new Error("One of the photos is invalid. Please upload it again.");
        }

        const url = cloudinary.url(publicId, { version, transformation: WATERMARK });
        const thumb = cloudinary.url(publicId, {
            version,
            transformation: [{ width: 600, height: 400, crop: "fill", gravity: "auto" }, ...WATERMARK],
        });

        return {
            cloudinary_public_id: publicId,
            cloudinary_url: url,
            thumbnail_url: thumb,
            display_order: index,
        };
    });
}

/** Best-effort cleanup, e.g. when saving the listing fails after photos were uploaded. */
export async function destroyPhotos(publicIds) {
    await Promise.allSettled(
        publicIds
            .filter((id) => String(id).startsWith(`${UPLOAD_FOLDER}/`))
            .map((id) => cloudinary.uploader.destroy(id))
    );
}
