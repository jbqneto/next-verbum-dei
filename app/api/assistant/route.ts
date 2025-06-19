export const dynamic = "force-dynamic";

import { delay } from "@/app/common/util";
import { ContextType } from "@/model/models";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

export const POST = async (req: NextRequest) => {
  const API_KEY = process.env.OPENAI_API_KEY;
  const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

  const { threadId, message, contextType } = await req.json();

  try {

    const requestMessage = message + " (return the response in HTML format)";

    const userIp = (req as any).ip ?? req.headers.get('x-forwarded-for')?.split(',')[0];
    const openai = new OpenAI({ apiKey: API_KEY! });

    let context = contextType as ContextType;

    // 1. Creates or reuse thread
    const thread = threadId ? { id: threadId } : await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: message,
        }
      ]
    });

    //2 - Add message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    console.log(`User: ${userIp} - Thread: ${thread.id}`);

    const ctxMap: Record<string, string> = {
      bible: "Use Catholic Bible passages only, cite Book:Chapter:Verse.",
      confession: "Guide the user through a confession exam with introspective questions, based specially on your files, cathechism and Padre Paulo.",
      catechism: "Base answer on Catechism, citing paragraphs (e.g. Catechism §1234).",
      moral: "Base answer on moral from your files and catechism and searches on Padre Paulo.",
      prayers: "Search the internet, specially on Vatican, Padre Paulo and other trusted websites."
    };

    let myRun = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
      additional_messages: [
        {
          role: 'assistant',
          content: 'Answer in html format'
        }
      ],
      ...(contextType && { additional_instructions: { content: ctxMap[context] } })
    });

    let runStatus = myRun.status;

    while (runStatus === "queued" || runStatus === "in_progress") {
      await delay(15000); // 15 seconds delay

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
    let msgs = [];

    for (const message of messages.getPaginatedItems()) {
      console.log("Msg: ", message);
      msgs.push({
        role: message.role,
        content: message.content
      });
    }

    // 4. Responde com stream + threadId
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Thread-Id": thread.id,
    });

    const payload = {
      message: msgs[0],
      context: contextType
    };

    return Response.json(payload, {
      headers,
    });
  } catch (error) {
    console.error("Error on OpenAPI", error);
  }
}