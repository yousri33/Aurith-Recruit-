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
  clientIp?: string;
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

  // Device Information
  const device = event.metadata?.device as any || {};
  if (device.model || device.os) {
    message += `\n<b>Device:</b>\n`;
    if (device.model) message += `  🔧 Model: ${device.model}\n`;
    if (device.os) message += `  🖥️ OS: ${device.os}`;
    if (device.osVersion) message += ` ${device.osVersion}`;
    message += `\n`;
    if (device.browser) message += `  🌐 Browser: ${device.browser}`;
    if (device.browserVersion) message += ` ${device.browserVersion}`;
    message += `\n`;
  } else if (event.userAgent) {
    const isMobile = /Mobile|Android|iPhone/.test(event.userAgent);
    const deviceType = isMobile ? "📱 Mobile" : "💻 Desktop";
    message += `<b>Device:</b> ${deviceType}\n`;
  }

  // Location Information
  if (device.timezone || device.language) {
    message += `\n<b>Location:</b>\n`;
    if (device.timezone) message += `  📍 Timezone: ${device.timezone}\n`;
    if (device.language) message += `  🌍 Language: ${device.language}\n`;
  }

  // Screen Information
  const screen = event.metadata?.screen as any;
  if (screen?.screenResolution) {
    message += `\n<b>Screen:</b>\n`;
    message += `  📐 Resolution: ${screen.screenResolution}\n`;
    if (screen.devicePixelRatio) {
      message += `  💾 Pixel Ratio: ${screen.devicePixelRatio}\n`;
    }
  }

  // IP Address
  if (event.clientIp && event.clientIp !== "Unknown") {
    message += `\n<b>Network:</b>\n`;
    message += `  🌐 IP: ${event.clientIp}\n`;
  }

  if (event.referrer && event.referrer !== "direct") {
    message += `<b>Referrer:</b> ${event.referrer}\n`;
  }

  // Connection Status
  if (device.onLine !== undefined) {
    message += `<b>Status:</b> ${device.onLine ? "🟢 Online" : "🔴 Offline"}\n`;
  }

  // Additional Device Capabilities
  const battery = event.metadata?.battery;
  const network = event.metadata?.network;
  const memory = event.metadata?.memory;

  if (battery || network || memory) {
    message += `\n<b>System:</b>\n`;
    if (battery?.level !== undefined) {
      message += `  🔋 Battery: ${Math.round(battery.level * 100)}%`;
      if (battery.charging) message += ` (⚡ Charging)`;
      message += `\n`;
    }
    if (network?.type) {
      message += `  📡 Network: ${network.type}`;
      if (network.downlink) message += ` (${network.downlink}Mbps)`;
      message += `\n`;
    }
    if (memory?.totalJSHeapSize) {
      const mb = Math.round(memory.totalJSHeapSize / 1048576);
      message += `  💾 Memory: ${mb}MB\n`;
    }
  }

  // Other metadata
  const otherMetadata = event.metadata
    ? Object.entries(event.metadata).filter(
        ([key]) =>
          !["device", "screen"].includes(key) &&
          key !== "device" &&
          key !== "os" &&
          key !== "browser"
      )
    : [];

  if (otherMetadata.length > 0) {
    message += `\n<b>Details:</b>\n`;
    otherMetadata.forEach(([key, value]) => {
      if (typeof value === "object") {
        message += `  • ${key}: ${JSON.stringify(value)}\n`;
      } else {
        message += `  • ${key}: ${value}\n`;
      }
    });
  }

  return message;
}

function getClientIp(request: NextRequest): string {
  // Check various headers for client IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to socket address (works in some environments)
  const ip = request.ip || "Unknown";
  return ip;
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

    // Get client IP
    const clientIp = getClientIp(request);

    // Add request metadata
    const event: TrackingEvent = {
      event: body.event || "page_view",
      website: body.website,
      page: body.page,
      title: body.title,
      referrer: request.headers.get("referer") || body.referrer,
      userAgent: request.headers.get("user-agent") || body.userAgent,
      timestamp: body.timestamp || Date.now(),
      clientIp: clientIp,
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
