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

interface GeoLocation {
  country?: string;
  city?: string;
  region?: string;
  lat?: number;
  lon?: number;
}

async function getGeolocation(ip: string): Promise<GeoLocation> {
  // Skip geolocation for local IPs
  if (
    ip.startsWith("127.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.includes("::1") ||
    ip.includes("::ffff:192") ||
    ip.includes("::ffff:127") ||
    ip === "Unknown"
  ) {
    return {
      city: "Local",
      country: "Local Testing",
      region: "N/A",
    };
  }

  try {
    // Use geojs.io (free, unlimited)
    const response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return { city: "Unknown", country: "Unknown", region: "Unknown" };
    }

    const data = (await response.json()) as Record<string, any>;
    return {
      country: data.country_name || data.country || "Unknown",
      city: data.city || "Unknown",
      region: data.region_name || data.region || "Unknown",
      lat: data.latitude,
      lon: data.longitude,
    };
  } catch (error) {
    console.error("Geolocation fetch error:", error);
    return { city: "Unknown", country: "Unknown", region: "Unknown" };
  }
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

function formatTelegramMessage(
  event: TrackingEvent,
  geo: GeoLocation
): string {
  const timestamp = new Date(event.timestamp || Date.now()).toLocaleString();
  const device = event.metadata?.device as any || {};
  const screen = event.metadata?.screen as any;

  let message = `<b>📊 VISITOR ALERT</b>\n\n`;

  // 1. LOCATION (TOP PRIORITY)
  message += `<b>📍 LOCATION</b>\n`;
  message += `  🌍 Country: <b>${geo.country || "Unknown"}</b>\n`;
  message += `  🏙️ City: <b>${geo.city || "Unknown"}</b>\n`;
  if (geo.region && geo.region !== "Unknown") {
    message += `  🗺️ Region: ${geo.region}\n`;
  }
  message += `\n`;

  // 2. DEVICE (OS & MOBILE MODEL)
  message += `<b>📱 DEVICE</b>\n`;
  if (device.os) {
    const osVersion = device.osVersion ? ` ${device.osVersion}` : "";
    message += `  🖥️ OS: <b>${device.os}${osVersion}</b>\n`;
  }
  if (device.model) {
    const isMobileDevice = device.isMobile ? "📱 " : "💻 ";
    message += `  ${isMobileDevice}Model: <b>${device.model}</b>\n`;
  }
  if (device.browser) {
    const browserVersion = device.browserVersion ? ` ${device.browserVersion}` : "";
    message += `  🌐 Browser: ${device.browser}${browserVersion}\n`;
  }
  if (device.timezone) {
    message += `  🕐 Timezone: ${device.timezone}\n`;
  }
  message += `\n`;

  // 3. PAGE INFO
  message += `<b>📄 PAGE</b>\n`;
  message += `  🌐 Website: ${event.website}\n`;
  message += `  📝 URL: <code>${event.page}</code>\n`;
  if (event.title) {
    message += `  📌 Title: ${event.title}\n`;
  }
  message += `  ⏱️ Time: ${timestamp}\n`;
  if (event.referrer && event.referrer !== "direct") {
    message += `  🔗 Referrer: ${event.referrer}\n`;
  }
  message += `\n`;

  // 4. NETWORK & IP
  message += `<b>🌐 NETWORK</b>\n`;
  if (event.clientIp) {
    message += `  IP: <code>${event.clientIp}</code>\n`;
  }
  const network = event.metadata?.network;
  if (network?.type) {
    message += `  📡 Connection: ${network.type}`;
    if (network.downlink) message += ` (${network.downlink}Mbps)`;
    message += `\n`;
  }
  if (network?.rtt) {
    message += `  ⏱️ RTT: ${network.rtt}ms\n`;
  }
  message += `\n`;

  // 5. SCREEN INFO
  if (screen?.screenResolution) {
    message += `<b>📐 SCREEN</b>\n`;
    message += `  Resolution: ${screen.screenResolution}\n`;
    if (device.cpuCores) {
      message += `  CPU Cores: ${device.cpuCores}\n`;
    }
    if (screen.devicePixelRatio) {
      message += `  Pixel Ratio: ${screen.devicePixelRatio}\n`;
    }
    message += `\n`;
  }

  // 6. SYSTEM (Battery, Memory, etc.)
  const battery = event.metadata?.battery;
  const memory = event.metadata?.memory;

  if (battery || memory || device.onLine !== undefined) {
    message += `<b>⚙️ SYSTEM</b>\n`;
    if (battery?.level !== undefined) {
      message += `  🔋 Battery: ${Math.round(battery.level * 100)}%`;
      if (battery.charging) message += ` (⚡ Charging)`;
      message += `\n`;
    }
    if (memory?.totalJSHeapSize) {
      const mb = Math.round(memory.totalJSHeapSize / 1048576);
      message += `  💾 Memory: ${mb}MB\n`;
    }
    if (device.onLine !== undefined) {
      message += `  Status: ${device.onLine ? "🟢 Online" : "🔴 Offline"}\n`;
    }
    message += `\n`;
  }

  // 7. EVENT TYPE
  message += `<b>Event:</b> ${event.event.replace(/_/g, " ").toUpperCase()}`;

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

    // Get geolocation data
    const geo = await getGeolocation(clientIp);

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
    const message = formatTelegramMessage(event, geo);
    const sent = await sendToTelegram(message);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, event, geolocation: geo },
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
