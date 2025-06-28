import { NextResponse } from "next/server";

export type MiddlewareHeaders = {
    [key: string]: string
}

export type MiddlewareResponse = {
    status: number;
    headers?: MiddlewareHeaders;
    response?: NextResponse;
    errorResponse?: NextResponse;
}