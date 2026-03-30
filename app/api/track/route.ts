import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7448243821";

interface TrackingEvent {
  event: "page_view" | "form_submit" | "click" | "custom";
  website: string;
  page: string;
  title?: string;
  referrer?: string;
  userAgent?: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

async function sendToTelegram(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

function formatTelegramMessage(event: TrackingEvent): string {
  const timestamp = new Date(event.timestamp || Date.now()).toLocaleString();

  let message = `<b>📊 Visitor Tracking Alert</b>\n\n`;
  message += `<b>Website:</b> ${event.website}\n`;
  message += `<b>Event:</b> ${event.event.replace(/_/g, " ").toUpperCase()}\n`;
  message += `<b>Page:</b> <code>${event.page}</code>\n`;

  if (event.title) {
    message += `<b>Title:</b> ${event.title}\n`;
  }

  message += `<b>Time:</b> ${timestamp}\n`;

  if (event.referrer && event.referrer !== "direct") {
    message += `<b>Referrer:</b> ${event.referrer}\n`;
  }

  if (event.userAgent) {
    // Extract OS and browser info
    const isMobile = /Mobile|Android|iPhone/.test(event.userAgent);
    const deviceType = isMobile ? "📱 Mobile" : "💻 Desktop";
    message += `<b>Device:</b> ${deviceType}\n`;
  }

  if (event.metadata && Object.keys(event.metadata).length > 0) {
    message += `\n<b>Details:</b>\n`;
    Object.entries(event.metadata).forEach(([key, value]) => {
      message += `  • ${key}: ${JSON.stringify(value)}\n`;
    });
  }

  return message;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TrackingEvent;

    // Validate required fields
    if (!body.website || !body.page) {
      return NextResponse.json(
        { error: "Missing required fields: website and page" },
        { status: 400 }
      );
    }

    // Add request metadata
    const event: TrackingEvent = {
      event: body.event || "page_view",
      website: body.website,
      page: body.page,
      title: body.title,
      referrer: request.headers.get("referer") || body.referrer,
      userAgent: request.headers.get("user-agent") || body.userAgent,
      timestamp: body.timestamp || Date.now(),
      metadata: body.metadata,
    };

    // Format and send to Telegram
    const message = formatTelegramMessage(event);
    const sent = await sendToTelegram(message);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
