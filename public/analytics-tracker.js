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

  function sendEvent(eventData) {
    if (!config.enabled || !config.trackingUrl) {
      log("Tracking disabled or URL not set");
      return;
    }

    const payload = {
      event: eventData.event,
      website: config.website,
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
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
