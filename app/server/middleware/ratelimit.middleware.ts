// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { IMiddleare } from './imiddleware';
import { MiddlewareResponse } from '@/model/response';

export class RateLimitMiddleware implements IMiddleare {

    private limitMS: number;
    private static instance: RateLimitMiddleware | undefined;
    private requestsMap = new Map<string, number>();

    private constructor(limitInSecs: number) {
        this.limitMS = limitInSecs * 1000;
    }

    public static getInstance(limit: number): RateLimitMiddleware {
        if (!RateLimitMiddleware.instance) {
            RateLimitMiddleware.instance = new RateLimitMiddleware(limit);
        }

        return RateLimitMiddleware.instance;
    }

    public async middleware(req: NextRequest): Promise<MiddlewareResponse> {
        console.log("Ratelimit middleware");
        const response = NextResponse.next();

        if (!req.nextUrl.pathname.startsWith('/api/assistant')) {
            return {
                status: 200,
                response
            }
        }

        const id = req.ip
            || req.headers.get('x-forwarded-for')?.split(',')[0]
            || req.headers.get('x-real-ip')
            || req.headers.get('X-Thread-Id')
            || 'unknown';

        const now = Date.now();
        const last = this.requestsMap.get(id) ?? 0;
        const diff = now - last;

        console.log("IP: " + id + " = " + diff);

        if (diff < this.limitMS) {
            return {
                status: 429,
                errorResponse: NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
            }
        }

        this.requestsMap.set(id, now);

        return {
            status: 200,
            headers: {
                'x-user-ip': id
            },
            response
        }
    }
}