import { NextResponse } from "next/server";

export function proxy(request) {
    const newHeaders = new Headers(request.headers);
    newHeaders.delete("userId");
    newHeaders.delete("role");

    return NextResponse.next({
        request: {
            headers: newHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/api/property/:path*",
        "/api/favourite/:path*",
        "/api/rating/:path*",
        "/api/booking/:path*",
        "/api/User/:path*",
        "/api/admin/:path*"
    ]
};
