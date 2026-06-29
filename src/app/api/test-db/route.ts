import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error(err);

    return Response.json({
      success: false,
      err,
    });
  }
}