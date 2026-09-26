"use client";
// Browser-side photo upload: shrink the image, then send it straight to Cloudinary.
// Our server only signs the request; the file never touches Netlify.

const MAX_EDGE = 1600;
const QUALITY = 0.8;
const MAX_INPUT_BYTES = 25 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/** Resize to at most 1600px on the long edge and re-encode as JPEG (~200–500 KB). */
async function compress(file) {
    let bitmap;
    try {
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
        // Browser can't decode it (e.g. HEIC outside Safari): send the original if Cloudinary accepts it.
        if (ACCEPTED.includes(file.type)) return file;
        throw new Error(`"${file.name}" isn't a supported image. Use JPG, PNG or WebP.`);
    }

    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF"; // transparent PNG areas become white, not black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
    if (!blob) throw new Error(`Couldn't process "${file.name}". Try another photo.`);
    return blob;
}

async function getSignature() {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.status === 401) {
        const err = new Error("Your session has expired. Please sign in again.");
        err.status = 401;
        throw err;
    }
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Couldn't start the upload.");
    return data;
}

/**
 * Upload one photo. `onProgress` receives 0–100.
 * Resolves to { public_id, version, secure_url, width, height } — send public_id and version
 * to the API; the server builds the final watermarked URLs.
 */
export async function uploadPhoto(file, onProgress = () => {}) {
    if (file.size > MAX_INPUT_BYTES) throw new Error(`"${file.name}" is larger than 25 MB.`);

    const [blob, sig] = await Promise.all([compress(file), getSignature()]);

    const form = new FormData();
    form.append("file", blob, file.name.replace(/\.\w+$/, "") + ".jpg");
    form.append("api_key", sig.apiKey);
    form.append("timestamp", sig.timestamp);
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);
    form.append("allowed_formats", sig.allowed_formats);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () => {
            let body = {};
            try { body = JSON.parse(xhr.responseText); } catch {}
            if (xhr.status >= 200 && xhr.status < 300 && body.public_id) {
                onProgress(100);
                const { public_id, version, secure_url, width, height } = body;
                resolve({ public_id, version, secure_url, width, height });
            } else {
                reject(new Error(body?.error?.message || `Upload of "${file.name}" failed. Please try again.`));
            }
        };
        xhr.onerror = () => reject(new Error("Network error while uploading. Check your connection and retry."));
        xhr.send(form);
    });
}
