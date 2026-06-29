import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptApiKey } from "@/lib/crypto";
import { updateChatbotSchema } from "@/lib/validators";

import { auth, authOptions } from "../../../../../auth";



/** GET /api/chatbots/:botId — Get single chatbot (no API key) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;

    // ✅ Add auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const chatbot = await prisma.chatbot.findUnique({
      where: { botId }, // ← Changed from id to botId
      select: {
        id: true,
         userId: true,
        botId: true,
        botName: true,
        botDesc: true,
        avatarUrl: true,
        provider: true,
        model: true,
        responseStyle: true,
        systemPrompt: true,
        welcomeMsg: true,
        primaryColor: true,
        widgetPos: true,
        widgetTitle: true,
        status: true,
        totalChats: true,
        totalMessages: true,
        createdAt: true,
        updatedAt: true,
        questions: {
          select: { id: true, question: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!chatbot) {
      return NextResponse.json(
        { success: false, error: "Chatbot not found" },
        { status: 404 }
      );
    }

    // ✅ Add ownership check
    if (chatbot.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: chatbot });
  } catch (error) {
    console.error("[GET /api/chatbots/:botId]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chatbot" },
      { status: 500 }
    );
  }
}

/** PATCH /api/chatbots/:botId — Update chatbot */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;

    // ✅ Add auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Check ownership before update
    const existing = await prisma.chatbot.findUnique({
      where: { botId },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Chatbot not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateChatbotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.botName !== undefined) updateData.botName = data.botName;
    if (data.botDesc !== undefined) updateData.botDesc = data.botDesc;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.provider !== undefined) updateData.provider = data.provider;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.systemPrompt !== undefined) updateData.systemPrompt = data.systemPrompt;
    if (data.responseStyle !== undefined) {
      updateData.responseStyle = data.responseStyle;
      updateData.temperature =
        data.responseStyle === "precise" ? 0.2 : data.responseStyle === "creative" ? 1.2 : 0.7;
    }
    if (data.welcomeMsg !== undefined) updateData.welcomeMsg = data.welcomeMsg;
    if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor;
    if (data.widgetPos !== undefined) updateData.widgetPos = data.widgetPos;
    if (data.widgetTitle !== undefined) updateData.widgetTitle = data.widgetTitle;

    // Handle new API key if provided
    if (body.apiKey && typeof body.apiKey === "string" && body.apiKey.length > 0) {
      const encrypted = encryptApiKey(body.apiKey);
      updateData.apiKey = encrypted.encrypted;
      updateData.apiKeyIv = encrypted.iv;
      updateData.apiKeyTag = encrypted.tag;
    }

    // Handle questions update
    if (data.questions !== undefined) {
      await prisma.suggestedQuestion.deleteMany({ where: { chatbotId: botId } });
      // ❌ FIX: Need to find the chatbot's internal id first
      const chatbot = await prisma.chatbot.findUnique({
        where: { botId },
        select: { id: true },
      });
      
      if (chatbot) {
        await prisma.suggestedQuestion.createMany({
          data: data.questions.map((q, i) => ({
            question: q,
            order: i,
            chatbotId: chatbot.id, // ← Use internal id, not botId
          })),
        });
      }
    }

    const updatedChatbot = await prisma.chatbot.update({
      where: { botId },
      data: updateData,
      select: {
        id: true,
        botId: true,
        botName: true,
        botDesc: true,
        avatarUrl: true,
        provider: true,
        model: true,
        responseStyle: true,
        welcomeMsg: true,
        primaryColor: true,
        widgetPos: true,
        widgetTitle: true,
        status: true,
        updatedAt: true,
        questions: { select: { id: true, question: true, order: true } },
      },
    });

    return NextResponse.json({ success: true, data: updatedChatbot });
  } catch (error) {
    console.error("[PATCH /api/chatbots/:botId]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update chatbot" },
      { status: 500 }
    );
  }
}

/** DELETE /api/chatbots/:botId — Delete chatbot */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;

    // ✅ Add auth check
   const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Check ownership
    const existing = await prisma.chatbot.findUnique({
      where: { botId },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Chatbot not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.chatbot.delete({ where: { botId } });

    return NextResponse.json({ success: true, message: "Chatbot deleted" });
  } catch (error) {
    console.error("[DELETE /api/chatbots/:botId]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete chatbot" },
      { status: 500 }
    );
  }
}