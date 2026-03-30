/**
 * Universal Website Analytics Tracker
 * Sends visitor events to your Telegram bot
 *
 * Usage:
 * <script src="https://your-domain.com/analytics-tracker.js"></script>
 * <script>
 *   WebsiteTracker.init({
 *     trackingUrl: 'https://your-domain.com/api/track',
 *     website: 'my-website.com',
 *     enabled: true
 *   });
 * </script>
 */

window.WebsiteTracker = (function () {
  let config = {
    trackingUrl: "",
    website: "",
    enabled: false,
    trackPageView: true,
    trackClicks: false,
    trackFormSubmit: false,
    debug: false,
  };

  function log(message, data) {
    if (config.debug) {
      console.log("[WebsiteTracker]", message, data || "");
    }
  }

  function detectDeviceInfo() {
    const ua = navigator.userAgent;
    let deviceModel = "Unknown";
    let osName = "Unknown";
    let osVersion = "Unknown";
    let browserName = "Unknown";
    let browserVersion = "Unknown";

    // Detect OS
    if (/Windows/.test(ua)) {
      osName = "Windows";
      const match = ua.match(/Windows NT ([\d.]+)/);
      if (match) {
        osVersion = match[1];
      }
    } else if (/iPhone/.test(ua)) {
      osName = "iOS";
      const match = ua.match(/OS ([\d_]+)/);
      if (match) {
        osVersion = match[1].replace(/_/g, ".");
      }
      // iPhone model detection
      if (/iPhone15,4|iPhone15,3|iPhone15,2|iPhone15,1|iPhone15/.test(ua)) {
        deviceModel = "iPhone 15";
      } else if (/iPhone14,7|iPhone14,6|iPhone14,5|iPhone14,4|iPhone14,3|iPhone14,2|iPhone14,1|iPhone14/.test(ua)) {
        deviceModel = "iPhone 14";
      } else if (/iPhone13,4|iPhone13,3|iPhone13,2|iPhone13,1/.test(ua)) {
        deviceModel = "iPhone 13";
      } else if (/iPhone12,8|iPhone12,5|iPhone12,4|iPhone12,3|iPhone12,2|iPhone12,1/.test(ua)) {
        deviceModel = "iPhone 12";
      } else if (/iPhone11,8|iPhone11,6|iPhone11,4|iPhone11,2/.test(ua)) {
        deviceModel = "iPhone 11";
      } else if (/iPhone SE/.test(ua)) {
        deviceModel = "iPhone SE";
      } else if (/iPhone/.test(ua)) {
        deviceModel = "iPhone";
      }
    } else if (/iPad/.test(ua)) {
      osName = "iPadOS";
      const match = ua.match(/OS ([\d_]+)/);
      if (match) {
        osVersion = match[1].replace(/_/g, ".");
      }
      if (/iPad Pro/.test(ua)) deviceModel = "iPad Pro";
      else if (/iPad Air/.test(ua)) deviceModel = "iPad Air";
      else if (/iPad Mini/.test(ua)) deviceModel = "iPad Mini";
      else deviceModel = "iPad";
    } else if (/Android/.test(ua)) {
      osName = "Android";
      const match = ua.match(/Android ([\d.]+)/);
      if (match) {
        osVersion = match[1];
      }
      // Popular Android devices
      if (/Samsung/.test(ua)) deviceModel = "Samsung Android";
      else if (/Google Pixel/.test(ua)) deviceModel = "Google Pixel";
      else if (/OnePlus/.test(ua)) deviceModel = "OnePlus";
      else deviceModel = "Android";
    } else if (/Mac OS X/.test(ua)) {
      osName = "macOS";
      const match = ua.match(/Mac OS X ([\d_]+)/);
      if (match) {
        osVersion = match[1].replace(/_/g, ".");
      }
    } else if (/Linux/.test(ua)) {
      osName = "Linux";
    }

    // Detect Browser
    if (/Chrome/.test(ua) && !/Edge/.test(ua)) {
      browserName = "Chrome";
      const match = ua.match(/Chrome\/([\d.]+)/);
      if (match) browserVersion = match[1];
    } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
      browserName = "Safari";
      const match = ua.match(/Version\/([\d.]+)/);
      if (match) browserVersion = match[1];
    } else if (/Firefox/.test(ua)) {
      browserName = "Firefox";
      const match = ua.match(/Firefox\/([\d.]+)/);
      if (match) browserVersion = match[1];
    } else if (/Edge/.test(ua)) {
      browserName = "Edge";
      const match = ua.match(/Edge\/([\d.]+)/);
      if (match) browserVersion = match[1];
    }

    return {
      deviceModel,
      osName,
      osVersion,
      browserName,
      browserVersion,
      isMobile: /Mobile|Android|iPhone/.test(ua),
      isTablet: /iPad|Android/.test(ua),
    };
  }

  function getLocationInfo() {
    // Try to get timezone
    let timezone = "Unknown";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      // Fallback to UTC offset
      timezone = "UTC" + new Date().getTimezoneOffset() / 60;
    }

    return { timezone };
  }

  function getScreenInfo() {
    return {
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      devicePixelRatio: window.devicePixelRatio,
    };
  }

  function getBatteryInfo() {
    // Battery Status API (limited support)
    if (navigator.getBattery) {
      return navigator.getBattery().then(battery => ({
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      })).catch(() => null);
    }
    return Promise.resolve(null);
  }

  function getNetworkInfo() {
    // Network Information API
    const connection = navigator.connection ||
                       navigator.mozConnection ||
                       navigator.webkitConnection;

    if (connection) {
      return {
        type: connection.effectiveType, // 4g, 3g, 2g, slow-2g
        downlink: connection.downlinkMax,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  function getMemoryInfo() {
    // Memory Information API (Chrome only)
    if (performance && performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  function getCpuCores() {
    // Get CPU cores
    return navigator.hardwareConcurrency || null;
  }

  function getStorageInfo() {
    // Storage information (if available)
    if (navigator.storage && navigator.storage.estimate) {
      return navigator.storage.estimate().then(estimate => ({
        usage: estimate.usage,
        quota: estimate.quota
      })).catch(() => null);
    }
    return Promise.resolve(null);
  }

  function sendEvent(eventData) {
    if (!config.enabled || !config.trackingUrl) {
      log("Tracking disabled or URL not set");
      return;
    }

    const deviceInfo = detectDeviceInfo();
    const locationInfo = getLocationInfo();
    const screenInfo = getScreenInfo();
    const networkInfo = getNetworkInfo();
    const memoryInfo = getMemoryInfo();
    const cpuCores = getCpuCores();

    const payload = {
      event: eventData.event,
      website: config.website,
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      // Enhanced device data
      device: {
        model: deviceInfo.deviceModel,
        os: deviceInfo.osName,
        osVersion: deviceInfo.osVersion,
        browser: deviceInfo.browserName,
        browserVersion: deviceInfo.browserVersion,
        isMobile: deviceInfo.isMobile,
        isTablet: deviceInfo.isTablet,
        timezone: locationInfo.timezone,
        screenResolution: screenInfo.screenResolution,
        language: navigator.language,
        onLine: navigator.onLine,
        cpuCores: cpuCores,
      },
      screen: screenInfo,
      network: networkInfo,
      memory: memoryInfo,
      metadata: eventData.metadata || {},
    };

    fetch(config.trackingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      log("Error sending event:", error);
    });
  }

  function trackPageView() {
    if (config.trackPageView) {
      sendEvent({
        event: "page_view",
        metadata: {
          url: window.location.href,
        },
      });
      log("Page view tracked:", window.location.pathname);
    }
  }

  function trackClick(event) {
    if (config.trackClicks && event.target) {
      const element = event.target;
      sendEvent({
        event: "click",
        metadata: {
          element: element.tagName,
          text: element.textContent?.substring(0, 50),
          id: element.id,
          class: element.className,
        },
      });
    }
  }

  function trackFormSubmit(event) {
    if (config.trackFormSubmit) {
      const form = event.target;
      sendEvent({
        event: "form_submit",
        metadata: {
          formId: form.id,
          formName: form.name,
          fieldCount: form.elements.length,
        },
      });
    }
  }

  function init(options) {
    config = { ...config, ...options };

    if (!config.website || !config.trackingUrl) {
      console.error(
        "[WebsiteTracker] Missing required config: website and trackingUrl"
      );
      return;
    }

    log("Initialized with config:", config);

    // Track page view on load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", trackPageView);
    } else {
      trackPageView();
    }

    // Track clicks if enabled
    if (config.trackClicks) {
      document.addEventListener("click", trackClick);
    }

    // Track form submissions if enabled
    if (config.trackFormSubmit) {
      document.addEventListener("submit", trackFormSubmit);
    }
  }

  function track(eventType, metadata) {
    sendEvent({
      event: eventType,
      metadata: metadata,
    });
  }

  function setEnabled(enabled) {
    config.enabled = enabled;
    log("Tracking enabled:", enabled);
  }

  return {
    init,
    track,
    setEnabled,
  };
})();
