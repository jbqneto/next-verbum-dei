import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { IMiddleare } from "./imiddleware";
import { MiddlewareResponse } from "@/model/response";

export class AuthMiddleware implements IMiddleare {

    private jwtSecret: Uint8Array | null = null;

    public constructor(secret: string | null) {
        this.jwtSecret = secret !== null ? new TextEncoder().encode(secret) : null;
    }

    public async middleware(req: NextRequest): Promise<MiddlewareResponse> {
        const token = req.cookies.get('token')?.value;
        const response = NextResponse.next();

        console.log("Auth middleware: " + token);

        //JWT Not yet configured
        if (!this.jwtSecret) return { status: 200, response };

        //For now /assistant is the only protected route
        if (!req.nextUrl.pathname.startsWith('/api/assistant')) {
            return { status: 200, response }
        }

        if (!token) {
            return {
                status: 302,
                errorResponse: NextResponse.redirect(new URL('/login', req.url))
            }
        }

        try {
            const { payload } = await jwtVerify(token, this.jwtSecret, {
                issuer: 'supabase',
                audience: 'authenticated'
            });

            return {
                status: 200,
                response,
                headers: {
                    'x-user-id': payload.sub as string
                }
            };

        } catch {
            return {
                status: 302,
                errorResponse: NextResponse.redirect(new URL('/login', req.url))
            }
        }
    }
}