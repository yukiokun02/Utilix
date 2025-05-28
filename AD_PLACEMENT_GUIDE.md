# 🚀 Google AdSense Integration Guide

## Quick Start - How to Add Your Ads

### Step 1: Find the Ad Areas
Look for these bright yellow highlighted sections in your code:
```
{/* ==================== [AD TYPE] AD AREA - START ==================== */}
{/* REPLACE THIS ENTIRE DIV WITH YOUR GOOGLE ADSENSE CODE */}
<div className="bg-yellow-500/20...">
  [Placeholder content]
</div>
{/* REPLACE ABOVE DIV WITH YOUR GOOGLE ADSENSE CODE */}
{/* ==================== [AD TYPE] AD AREA - END ==================== */}
```

### Step 2: Replace with Your AdSense Code
1. Copy your Google AdSense code snippet
2. Delete the ENTIRE placeholder div (from `<div className="bg-yellow-500/20...">` to `</div>`)
3. Paste your AdSense code in its place
4. Keep the comment lines for easy identification

## 📍 Ad Placement Locations

### Homepage (home.tsx)
- **Top Mobile Ad**: Line ~30 (320x50)
- **Top Desktop Ad**: Line ~42 (728x90)
- **Middle Mobile Ad**: Line ~126 (320x50)
- **Middle Desktop Ad**: Line ~136 (728x90)

### Tool Pages
All tool pages have consistent ad placements:
- **Top Ad**: Below navigation
- **Middle Ad**: Between content sections
- **Bottom Ad**: Before footer
- **Sidebar Ad**: Desktop only (160x600)

### Info Pages (About, Terms, Privacy)
- **Top Ad**: Below page title
- **Middle Ad**: Between content sections
- **Bottom Ad**: Before footer

## 🎯 Ad Sizes by Device

### Mobile Ads
- **Banner**: 320x50
- **Medium Rectangle**: 320x100
- **Large Banner**: 320x100

### Desktop Ads
- **Leaderboard**: 728x90
- **Medium Rectangle**: 300x250
- **Skyscraper**: 160x600
- **Large Rectangle**: 336x280

## ✅ Example Replacement

### Before (Placeholder):
```jsx
{/* REPLACE THIS ENTIRE DIV WITH YOUR GOOGLE ADSENSE CODE */}
<div className="bg-yellow-500/20 rounded-lg p-4 text-center text-yellow-300 border-2 border-yellow-500/50">
  <div className="h-24 flex items-center justify-center text-sm font-bold">
    💻 DESKTOP TOP AD (728x90) - Replace with AdSense Code
  </div>
</div>
{/* REPLACE ABOVE DIV WITH YOUR GOOGLE ADSENSE CODE */}
```

### After (With AdSense):
```jsx
{/* REPLACE THIS ENTIRE DIV WITH YOUR GOOGLE ADSENSE CODE */}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7651606911286911"
     crossorigin="anonymous"></script>
<ins className="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-7651606911286911"
     data-ad-slot="YOUR_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
{/* REPLACE ABOVE DIV WITH YOUR GOOGLE ADSENSE CODE */}
```

## 🔄 After Making Changes

1. Save your files
2. Run `npm run build` on your VPS
3. Restart your service: `sudo systemctl restart utilitix`
4. Test your ads are showing correctly

## 📋 Checklist
- [ ] Homepage top ads (mobile + desktop)
- [ ] Homepage middle ads (mobile + desktop)
- [ ] Image tool ads (3 placements + sidebar)
- [ ] File converter ads (3 placements)
- [ ] Color picker ads (3 placements)
- [ ] Font changer ads (3 placements)
- [ ] File compressor ads (3 placements)
- [ ] Text editor ads (3 placements)
- [ ] About page ads (3 placements)
- [ ] Terms page ads (3 placements)
- [ ] Privacy page ads (3 placements)

Total: ~35 ad placements across your entire website!