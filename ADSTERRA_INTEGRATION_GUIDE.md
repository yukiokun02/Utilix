# 🚀 Adsterra Integration Guide - Vite Build Safe Components

## ✅ Components Created

I've created two reusable Adsterra ad components that are **Vite build-safe**:

### 1. AdsterraAdMobile.tsx
- **Mobile Ad Key**: `9713846a01389bccb7945a5638e800ae`
- **Dimensions**: 320x50
- **CSS Classes**: `absolute top-2 left-4 right-4 z-20 block lg:hidden`

### 2. AdsterraAdDesktop.tsx  
- **Desktop Ad Key**: `cb2ed6205d66bc197d403ba9e8a43db6`
- **Dimensions**: 728x90
- **CSS Classes**: `hidden lg:block mb-8`

## 📖 How to Use

### Import the Components
```tsx
import AdsterraAdMobile from "@/components/AdsterraAdMobile";
import AdsterraAdDesktop from "@/components/AdsterraAdDesktop";
```

### Use in Your Pages
```tsx
export default function YourPage() {
  return (
    <div>
      {/* Mobile Ad */}
      <AdsterraAdMobile />
      
      {/* Desktop Ad */}
      <AdsterraAdDesktop />
      
      {/* Your page content */}
    </div>
  );
}
```

### Alternative: Wrapped in Custom Containers
```tsx
{/* If you need custom spacing/styling */}
<div className="my-8">
  <AdsterraAdDesktop />
</div>

<div className="block lg:hidden mb-6">  
  <AdsterraAdMobile />
</div>
```

## 🔧 How It Works

Each component uses `useEffect` to:
1. Create a `<script>` element with your `atOptions` configuration
2. Create a second `<script>` element that loads the Adsterra invoke.js
3. Dynamically append both scripts to the DOM
4. Clean up when the component unmounts

## ✅ Benefits

- **Vite Build Safe**: No raw `<script>` tags in JSX
- **No dangerouslySetInnerHTML**: Cleaner React code
- **Production Ready**: Works in both development and production builds
- **Reusable**: Import once, use anywhere
- **Responsive**: Separate mobile/desktop components

## 🏠 Homepage Updated

Your homepage now uses these components for all ad placements:
- Mobile top ad
- Desktop top ad  
- Mobile middle ad
- Desktop middle ad

## 📝 Next Steps

To add ads to other pages:
1. Import both components
2. Place `<AdsterraAdMobile />` and `<AdsterraAdDesktop />` where you want ads
3. Wrap in containers if you need custom styling
4. Build and deploy - it will work perfectly!

This approach ensures your ads will display properly on your live VPS without any Vite build issues.