import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/** GET /api/chatbots/:botId/public — Public config for widget (NO AUTH, NO SECRETS) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params

    const chatbot = await prisma.chatbot.findUnique({
      where: { botId },
      select: {
        botId: true,
        botName: true,
        welcomeMsg: true,
        primaryColor: true,
        widgetPos: true,
        widgetTitle: true,
        avatarUrl: true,
        status: true,
        questions: {
          select: { question: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!chatbot || chatbot.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Chatbot not found or inactive" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: chatbot.botId,
        name: chatbot.botName,
        welcomeMessage: chatbot.welcomeMsg,
        primaryColor: chatbot.primaryColor,
        widgetPosition: chatbot.widgetPos,
        widgetTitle: chatbot.widgetTitle,
        avatar: chatbot.avatarUrl,
        status: chatbot.status,
        questions: chatbot.questions,
      },
    })
  } catch (error) {
    console.error("[GET /api/chatbots/:botId/public]", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch chatbot" },
      { status: 500 }
    )
  }
}