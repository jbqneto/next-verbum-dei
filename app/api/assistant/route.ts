export const dynamic = "force-dynamic";

import { delay } from "@/app/common/util";
import { ContextType } from "@/model/models";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

import OpenAI from "openai";

const ctxMap: Record<string, string> = {
  bible: "Use Catholic Bible passages only, cite Book:Chapter:Verse.",
  confession: "Guide the user through a confession exam with introspective questions, based specially on your files, cathechism and Padre Paulo.",
  catechism: "Base answer on Catechism, citing paragraphs (e.g. Catechism §1234).",
  moral: "Base answer on moral from your files and catechism and searches on Padre Paulo.",
  prayers: "Search the internet, specially on Vatican, Padre Paulo and other trusted websites."
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

function getClientIp(req: Request): string {
  const header = req.headers.get("x-forwarded-for") || "";
  const ip = header.split(",")[0]?.trim();
  const isValidIp = ip && ip !== "::1" && ip !== "127.0.0.1";

  return isValidIp ? ip : "unknown";
}

export const POST = async (req: NextRequest) => {
  const API_KEY = process.env.OPENAI_API_KEY;
  const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

  const { threadId, message, contextType, language } = await req.json();
  const now = Date.now();
  const userLanguage = language ? '(lang: ' + language + ')' : '';

  try {
    const cookieStore = cookies();
    const lastMessageTime = Number(cookieStore.get('lastMessage')?.value || 0);
    const openai = new OpenAI({ apiKey: API_KEY! });

    let context = contextType as ContextType;

    if (now - lastMessageTime < 60_000) {
      return NextResponse.json({ error: 'WAIT' }, { status: 429 });
    }

    const finalThreadId = threadId ?? cookieStore.get('threadId')?.value;

    console.log("finalThreadId: ", finalThreadId);

    // 1. Creates or reuse thread
    const thread = finalThreadId ? { id: finalThreadId } : await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: userLanguage + ':' + message,
        }
      ]
    });

    //2 - Add message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    const contextText = context ? ctxMap[context] : null;
    let instructions = "Do not repeat the use message. Return the answer strictly as formatted HTML with appropriate tags such as <h2>, <p>, <ul>, <strong>, <em>, <b>,<i>, <br/>. Do not include any explanation or summary outside HTML or other format.";

    if (contextText) {
      instructions = `Important: ${context}.` + instructions;
    }

    instructions += 'At the end of the explanatory text, break 2 lines with <br/><br/> and a text like this "tags: [$LIST_OF_RELATED_TAGS_IN_ENGLISH]".';

    let myRun = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID!,
      instructions,
      additional_instructions: "Identify the subject of the question and if is not related to the bible, catholic church or cathecism just answer that is not related to our focus."
    });

    let runStatus = myRun.status;

    while (runStatus === "queued" || runStatus === "in_progress") {
      await delay(5000); // 15 seconds delay

      myRun = await openai.beta.threads.runs.retrieve(myRun.id, {
        thread_id: threadId
      });

      runStatus = myRun.status;

      console.log("MyRun: " + myRun.status, myRun.metadata);

      if (runStatus === "completed") {
        break;
      } else {
        throw new Error(`Run status: ${runStatus}`);
      }
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const responseMessages = messages.getPaginatedItems().filter(m => m.role === 'assistant');

    // 4. Responde com stream + threadId
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Thread-Id": thread.id
    });

    headers.set('Set-Cookie', [
      `threadId=${thread.id}; Path=/; HttpOnly; Max-Age=31536000`,
      `lastMessage=${now}; Path=/; HttpOnly; Max-Age=60`
    ].join(', '));

    const responseMessage = responseMessages.at(0);

    const payload = {
      message: {
        id: responseMessage?.id,
        content: responseMessage?.content ?? "",
        created_at: responseMessage?.created_at
      },
      context: contextType,
      threadId
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err: any) {
    console.error("Error on OpenAPI", err);
    return Response.json({
      error: err.message
    }, {
      status: 500
    });
  }
}