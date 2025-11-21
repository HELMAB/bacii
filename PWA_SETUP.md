# PWA Setup Guide

## Overview
Dobpi is now a Progressive Web App (PWA) that can be installed on devices and works offline!

## Features Implemented

### 1. **Offline Access**
- PDFs are automatically cached when viewed
- Previously viewed PDFs work without internet
- Static assets cached for fast loading

### 2. **App Installation**
- Install prompt appears automatically
- Can be installed on mobile and desktop
- Works like a native app

### 3. **Offline Indicator**
- Shows when device is offline
- Notifies when back online
- Clear visual feedback

## Required Icons

You need to generate and add these icon files to the `public` folder:

### Required Icon Sizes:
- `/public/icon-72x72.png`
- `/public/icon-96x96.png`
- `/public/icon-128x128.png`
- `/public/icon-144x144.png`
- `/public/icon-152x152.png`
- `/public/icon-192x192.png`
- `/public/icon-384x384.png`
- `/public/icon-512x512.png`

### Screenshots (optional but recommended):
- `/public/screenshot-wide.png` (1280x720)
- `/public/screenshot-narrow.png` (720x1280)

## How to Generate Icons

### Option 1: Use an online tool
- Visit: https://www.pwabuilder.com/imageGenerator
- Upload your logo/icon
- Download all sizes

### Option 2: Use ImageMagick (command line)
```bash
# Install ImageMagick first, then:
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

## Testing PWA

### 1. **Local Testing**
```bash
npm run build
npm run preview
```

### 2. **Check PWA Status**
- Open DevTools (F12)
- Go to "Application" tab
- Check "Manifest" section
- Check "Service Workers" section

### 3. **Test Offline**
- Open app in browser
- View some PDFs
- Open DevTools > Network tab
- Select "Offline" in throttling dropdown
- Navigate the app - cached PDFs should work!

## Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari/iOS Safari (Partial - no install prompt)
- ✅ Samsung Internet (Full support)

## Cache Management

The service worker caches three types of content:

1. **Static Cache**: HTML, CSS, JS, images
2. **PDF Cache**: Viewed PDF files
3. **Runtime Cache**: Dynamic content

### Clear Cache Manually
Open DevTools Console and run:
```javascript
navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
```

## Deployment Notes

- Service workers only work on HTTPS (or localhost)
- Netlify automatically serves on HTTPS ✓
- Make sure all icon files are uploaded

## Troubleshooting

### Install Prompt Not Showing
- Make sure all icons are present
- Check browser console for errors
- Some browsers (Safari) don't show install prompts

### PDFs Not Working Offline
- Make sure you viewed them while online first
- Check Service Worker status in DevTools
- Clear cache and try again

### Service Worker Not Registering
- Check browser console for errors
- Make sure you're on HTTPS
- Try clearing browser data

## User Instructions (Khmer)

### ការដំឡើងកម្មវិធី:
1. បើកគេហទំព័រ dobpi.netlify.app
2. រង់ចាំសារដំឡើង (ប្រហែល 5 វិនាទី)
3. ចុច "ដំឡើង"
4. រីករាយជាមួយកម្មវិធី!

### ការប្រើប្រាស់ក្រៅបណ្តាញ:
1. មើលឯកសារណាមួយ (វានឹងរក្សាទុកដោយស្វ័យប្រវត្តិ)
2. បិទអ៊ីនធឺណិត
3. បើកកម្មវិធី
4. ឯកសារដែលបានមើលរួចនឹងដំណើរការ!

## Next Steps

- [ ] Generate all required icons
- [ ] Take screenshots for app stores
- [ ] Test on multiple devices
- [ ] Monitor service worker errors
- [ ] Consider adding update notification

## Additional Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
