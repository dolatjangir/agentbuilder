import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/chatbots/:id/messages — Get chat history */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    const where: Record<string, unknown> = { chatbotId: id };
    if (sessionId) {
      const session = await prisma.chatSession.findUnique({ where: { sessionId } });
      if (session) {
        where.sessionId = session.id;
      }
    }

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          role: true,
          content: true,
          providerUsed: true,
          modelUsed: true,
          tokensUsed: true,
          createdAt: true,
        },
      }),
      prisma.chatMessage.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: messages.reverse(), // Oldest first
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/chatbots/:id/messages]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}