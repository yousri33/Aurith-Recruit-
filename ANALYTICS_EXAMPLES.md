# Analytics Integration Examples

Copy-paste ready code for your websites.

## 🎯 Setup Your Tracking URLs

Replace these in all examples:
- `YOUR_API_URL`: `https://aurith-recruit.vercel.app/api/track`
- `YOUR_WEBSITE_NAME`: Your domain (e.g., `mysite.com`, `blog.example.com`)

---

## HTML / Static Sites

### Minimal Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website</title>
</head>
<body>
  <h1>Welcome</h1>

  <!-- Add before </body> -->
  <script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
  <script>
    WebsiteTracker.init({
      trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
      website: 'mysite.com',
      enabled: true,
      trackPageView: true
    });
  </script>
</body>
</html>
```

---

## Next.js

### App Router (Next.js 13+)

**app/layout.tsx**:
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://aurith-recruit.vercel.app/analytics-tracker.js"
          strategy="afterInteractive"
        />
        <script strategy="afterInteractive">
          {`
            WebsiteTracker.init({
              trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
              website: 'mysite.com',
              enabled: true,
              trackPageView: true
            });
          `}
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Custom Hook

**lib/useAnalytics.ts**:
```typescript
import { useEffect } from 'react';

declare global {
  interface Window {
    WebsiteTracker?: any;
  }
}

export function useAnalytics(websiteName: string) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.WebsiteTracker) {
      window.WebsiteTracker.init({
        trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
        website: websiteName,
        enabled: true,
        trackPageView: true
      });
    }
  }, [websiteName]);
}
```

**Use in component**:
```tsx
import { useAnalytics } from '@/lib/useAnalytics';

export default function Home() {
  useAnalytics('mysite.com');

  return <main>Your content</main>;
}
```

---

## React (Create React App / Vite)

### Using useEffect

**src/hooks/useAnalytics.ts**:
```typescript
import { useEffect } from 'react';

declare global {
  interface Window {
    WebsiteTracker?: any;
  }
}

export function useAnalytics(websiteName: string) {
  useEffect(() => {
    const loadTracker = async () => {
      if (document.getElementById('analytics-script')) return;

      const script = document.createElement('script');
      script.id = 'analytics-script';
      script.src = 'https://aurith-recruit.vercel.app/analytics-tracker.js';
      script.async = true;

      script.onload = () => {
        if (window.WebsiteTracker) {
          window.WebsiteTracker.init({
            trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
            website: websiteName,
            enabled: true,
            trackPageView: true
          });
        }
      };

      document.head.appendChild(script);
    };

    loadTracker();
  }, []);
}
```

**App.tsx**:
```tsx
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  useAnalytics('mysite.com');

  return (
    <div>
      <h1>My React App</h1>
    </div>
  );
}

export default App;
```

---

## Vue.js

**src/composables/useAnalytics.ts**:
```typescript
import { onMounted } from 'vue';

declare global {
  interface Window {
    WebsiteTracker?: any;
  }
}

export function useAnalytics(websiteName: string) {
  onMounted(() => {
    if (document.getElementById('analytics-script')) return;

    const script = document.createElement('script');
    script.id = 'analytics-script';
    script.src = 'https://aurith-recruit.vercel.app/analytics-tracker.js';
    script.async = true;

    script.onload = () => {
      if (window.WebsiteTracker) {
        window.WebsiteTracker.init({
          trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
          website: websiteName,
          enabled: true,
          trackPageView: true
        });
      }
    };

    document.head.appendChild(script);
  });
}
```

**App.vue**:
```vue
<template>
  <div>
    <h1>My Vue App</h1>
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '@/composables/useAnalytics';

useAnalytics('mysite.com');
</script>
```

---

## WordPress

### Add to Theme

**wp-content/themes/your-theme/functions.php**:
```php
<?php
/**
 * Add analytics tracker to website footer
 */
function add_website_analytics() {
  $api_url = 'https://aurith-recruit.vercel.app/api/track';
  $site_url = parse_url(get_bloginfo('url'), PHP_URL_HOST);
  $site_url = str_replace('www.', '', $site_url); // Remove www

  ?>
  <script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
  <script>
    WebsiteTracker.init({
      trackingUrl: '<?php echo esc_js($api_url); ?>',
      website: '<?php echo esc_js($site_url); ?>',
      enabled: true,
      trackPageView: true,
      trackFormSubmit: false,
      debug: false
    });
  </script>
  <?php
}
add_action('wp_footer', 'add_website_analytics');
```

### Add via Header

Alternatively, add to **wp-content/themes/your-theme/header.php** before closing `</head>`:

```html
<script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
<script>
  WebsiteTracker.init({
    trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
    website: '<?php echo esc_attr(str_replace('www.', '', parse_url(get_bloginfo('url'), PHP_URL_HOST))); ?>',
    enabled: true,
    trackPageView: true
  });
</script>
```

---

## Svelte / SvelteKit

**src/lib/analytics.ts**:
```typescript
declare global {
  interface Window {
    WebsiteTracker?: any;
  }
}

export async function initAnalytics(websiteName: string) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('analytics-script')) return;

  const script = document.createElement('script');
  script.id = 'analytics-script';
  script.src = 'https://aurith-recruit.vercel.app/analytics-tracker.js';
  script.async = true;

  return new Promise((resolve) => {
    script.onload = () => {
      if (window.WebsiteTracker) {
        window.WebsiteTracker.init({
          trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
          website: websiteName,
          enabled: true,
          trackPageView: true
        });
      }
      resolve(true);
    };
    document.head.appendChild(script);
  });
}
```

**src/routes/+layout.svelte**:
```svelte
<script>
  import { onMount } from 'svelte';
  import { initAnalytics } from '$lib/analytics';

  onMount(() => {
    initAnalytics('mysite.com');
  });
</script>

<slot />
```

---

## Astro

**src/layouts/BaseLayout.astro**:
```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
    <script>
      WebsiteTracker.init({
        trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
        website: 'mysite.com',
        enabled: true,
        trackPageView: true
      });
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Angular

**src/index.html**:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My App</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
  </head>
  <body>
    <app-root></app-root>
    <script>
      WebsiteTracker.init({
        trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
        website: 'mysite.com',
        enabled: true,
        trackPageView: true
      });
    </script>
  </body>
</html>
```

---

## Track Custom Events

### Button Click

```javascript
document.getElementById('myButton').addEventListener('click', () => {
  WebsiteTracker.track('custom', {
    action: 'button_click',
    buttonId: 'myButton',
    buttonText: 'Sign Up'
  });
});
```

### Form Submission

```javascript
document.getElementById('myForm').addEventListener('submit', (e) => {
  WebsiteTracker.track('form_submit', {
    formId: 'myForm',
    action: 'newsletter_signup'
  });
});
```

### Product View (E-commerce)

```javascript
// When user views a product
WebsiteTracker.track('custom', {
  action: 'product_view',
  productId: '12345',
  productName: 'Blue Widget',
  price: 29.99
});
```

### Conversion

```javascript
// When user completes a purchase
WebsiteTracker.track('custom', {
  action: 'purchase',
  orderId: 'ORD-123456',
  amount: 99.99,
  items: 3
});
```

---

## Testing

Open browser DevTools console and run:

```javascript
// Check if tracker is loaded
console.log(window.WebsiteTracker);

// Enable debug mode
WebsiteTracker.setEnabled(true);

// Manually send an event
WebsiteTracker.track('test', {
  test: 'data'
});

// Check Telegram - you should receive a message!
```

---

## Troubleshooting

### Script not loading
- Check browser console for CORS errors
- Verify `trackingUrl` is correct
- Ensure domain is accessible from your website

### Events not sent
- Open DevTools Network tab
- Look for POST requests to `/api/track`
- Check console for JavaScript errors
- Enable `debug: true` in config

### No Telegram messages
- Verify bot token is correct: `8690027071:AAH4Bl49LURNI0RBQjhBsA5AzgwdRBFkSDk`
- Verify chat ID is correct: `7448243821`
- Try enabling debug: `debug: true`
- Test manually: POST to `/api/track` with sample data

---

Questions? Check **ANALYTICS_SETUP.md** for full documentation.
