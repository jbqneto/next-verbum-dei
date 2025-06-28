import { NextRequest, NextResponse } from "next/server";
import { RateLimitMiddleware } from "./app/server/middleware/ratelimit.middleware";
import { AuthMiddleware } from "./app/server/middleware/auth.middleware";

const LIMIT_IN_SECS = process.env.NEXT_PUBLIC_COOLDOWN ?? "60";

const rateLimiter = RateLimitMiddleware.getInstance(parseInt(LIMIT_IN_SECS));
const authMiddleware = new AuthMiddleware(process.env.SUPABASE_JWT_SECRET ?? "");

/**
 * TODO: Create a Middleware responseBuilder
 * @param req 
 * @returns 
 */


export async function middleware(req: NextRequest) {
    console.log("Is this middleare working?");
    let response;
    let successResponse = NextResponse.next();

    response = await rateLimiter.middleware(req);

    let headers = response.headers ?? {};

    Object.keys(headers).forEach((key) => {
        successResponse.headers.set(key, headers[key]);
    });

    if (response.errorResponse) {
        return response.errorResponse;
    }

    //TODO: Do this latter
    //response = await authMiddleware.middleware(req);

    Object.keys(headers).forEach((key) => {
        successResponse.headers.set(key, headers[key]);
    });

    if (response.errorResponse) {
        return response.errorResponse;
    }

    return successResponse;
}


export const config = {
    matcher: ['/api/assistant/:path']
};