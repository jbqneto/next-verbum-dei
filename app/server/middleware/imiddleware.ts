import { MiddlewareResponse } from "@/model/response";
import { NextRequest, NextResponse } from "next/server";

export interface IMiddleare {
    middleware(req: NextRequest): Promise<MiddlewareResponse>;
}