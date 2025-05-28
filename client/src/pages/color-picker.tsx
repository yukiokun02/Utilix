import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, PaletteIcon, CopyIcon, CircleIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ColorFormats {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
  htmlName: string;
}

const HTML_COLORS: Record<string, string> = {
  "#FF0000": "red", "#00FF00": "lime", "#0000FF": "blue", "#FFFF00": "yellow",
  "#FF00FF": "magenta", "#00FFFF": "cyan", "#000000": "black", "#FFFFFF": "white",
  "#808080": "gray", "#800000": "maroon", "#008000": "green", "#000080": "navy",
  "#808000": "olive", "#800080": "purple", "#008080": "teal", "#C0C0C0": "silver",
  "#FFA500": "orange", "#FFC0CB": "pink", "#A52A2A": "brown"
};

export default function ColorPicker() {
  const [currentColor, setCurrentColor] = useState<ColorFormats>({
    hex: "#FF5733",
    rgb: { r: 255, g: 87, b: 51 },
    hsl: { h: 14, s: 100, l: 60 },
    hsv: { h: 14, s: 80, v: 100 },
    cmyk: { c: 0, m: 66, y: 80, k: 0 },
    htmlName: ""
  });
  
  const [pickerMode, setPickerMode] = useState<'spectrum' | 'palette'>('spectrum');
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hueSliderPosition, setHueSliderPosition] = useState(0);
  const { toast } = useToast();
  
  const paletteRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  // Color conversion functions
  const hexToRgb = useCallback((hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }, []);

  const rgbToHsl = useCallback((r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }, []);

  const rgbToHsv = useCallback((r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  }, []);

  const rgbToCmyk = useCallback((r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }, []);

  const getHtmlColorName = useCallback((hex: string): string => {
    return HTML_COLORS[hex.toUpperCase()] || "";
  }, []);

  const updateAllFormats = useCallback((rgb: { r: number; g: number; b: number }) => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const htmlName = getHtmlColorName(hex);

    setCurrentColor({
      hex,
      rgb,
      hsl,
      hsv,
      cmyk,
      htmlName
    });
  }, [rgbToHex, rgbToHsl, rgbToHsv, rgbToCmyk, getHtmlColorName]);

  const handlePaletteClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!paletteRef.current) return;
    
    const rect = paletteRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setCursorPosition({ x, y });
    
    const saturation = Math.min(100, Math.max(0, (x / rect.width) * 100));
    const lightness = Math.min(100, Math.max(0, 100 - (y / rect.height) * 100));
    
    // Convert HSL to RGB for the selected position
    const hue = currentColor.hsl.h;
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    updateAllFormats({
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    });
  }, [currentColor.hsl.h, updateAllFormats]);

  const handleHueChange = useCallback((clientX: number) => {
    if (!hueSliderRef.current) return;
    
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const hue = (x / rect.width) * 360;
    
    setHueSliderPosition(x);
    
    // Update with new hue, keeping current saturation and lightness
    const h = hue / 360;
    const s = currentColor.hsl.s / 100;
    const l = currentColor.hsl.l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    updateAllFormats({
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    });
  }, [currentColor.hsl.s, currentColor.hsl.l, updateAllFormats]);

  const handleHueMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsHueDragging(true);
    handleHueChange(event.clientX);
  }, [handleHueChange]);

  const handleHueTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    setIsHueDragging(true);
    const touch = event.touches[0];
    handleHueChange(touch.clientX);
  }, [handleHueChange]);

  const handleCopyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  }, [toast]);

  const formatColorStrings = useCallback(() => {
    return {
      hex: currentColor.hex,
      rgb: `rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`,
      hsl: `hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`,
      hsv: `hsv(${currentColor.hsv.h}, ${currentColor.hsv.s}%, ${currentColor.hsv.v}%)`,
      cmyk: `cmyk(${currentColor.cmyk.c}%, ${currentColor.cmyk.m}%, ${currentColor.cmyk.y}%, ${currentColor.cmyk.k}%)`,
      htmlName: currentColor.htmlName || "N/A"
    };
  }, [currentColor]);

  const colorStrings = formatColorStrings();

  // Touch event handlers for mobile support
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging && !isHueDragging) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    
    if (isDragging && paletteRef.current?.contains(event.target as Node)) {
      const rect = paletteRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setCursorPosition({ x, y });
    }
    
    if (isHueDragging) {
      handleHueChange(touch.clientX);
    }
  }, [isDragging, isHueDragging, handleHueChange]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isHueDragging) {
      handleHueChange(event.clientX);
    }
  }, [isHueDragging, handleHueChange]);

  useEffect(() => {
    if (isDragging || isHueDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchend', () => {
        setIsDragging(false);
        setIsHueDragging(false);
      });
      document.addEventListener('mouseup', () => {
        setIsDragging(false);
        setIsHueDragging(false);
      });
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchend', () => {
          setIsDragging(false);
          setIsHueDragging(false);
        });
        document.removeEventListener('mouseup', () => {
          setIsDragging(false);
          setIsHueDragging(false);
        });
      };
    }
  }, [isDragging, isHueDragging, handleTouchMove, handleMouseMove]);

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      {/* Top Ad Banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gray-800/30 rounded-lg p-3 text-center text-gray-400 border border-gray-600/30 mb-6">
          <div className="h-16 sm:h-20 lg:h-24 flex items-center justify-center text-xs sm:text-sm">
            Top Ad Banner (728x90 / 320x50)
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🎨 Color Picker Tool
              </span>
            </h1>
            <p className="text-gray-300 font-medium text-sm sm:text-base">
              Pick and convert colors in HEX, RGB, HSL, HSV, and CMYK formats
            </p>
          </div>
          <div className="flex-shrink-0 self-start lg:self-center">
            <Link href="/">
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Color Picker Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* How to Use Section */}
            <Card className="solid-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Choose between palette or wheel mode, click or drag to select colors, and copy the format you need. 
                  You can also enter color values directly in any format to update the picker.
                </p>
              </CardContent>
            </Card>

            {/* Picker Mode Toggle */}
            <div className="flex gap-4">
              <Button
                variant={pickerMode === 'spectrum' ? 'default' : 'outline'}
                onClick={() => setPickerMode('spectrum')}
                className="flex items-center gap-2"
              >
                <PaletteIcon className="w-4 h-4" />
                Spectrum
              </Button>
              <Button
                variant={pickerMode === 'palette' ? 'default' : 'outline'}
                onClick={() => setPickerMode('palette')}
                className="flex items-center gap-2"
              >
                <CircleIcon className="w-4 h-4" />
                Palette
              </Button>
            </div>

            {/* Color Picker Interface */}
            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground">Color Picker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {pickerMode === 'spectrum' ? (
                  <div className="space-y-4">
                    {/* Color Palette */}
                    <div className="relative">
                      <div
                        ref={paletteRef}
                        className="w-full h-64 rounded-lg cursor-crosshair relative overflow-hidden border border-border"
                        style={{
                          background: `linear-gradient(to right, white, hsl(${currentColor.hsl.h}, 100%, 50%))`,
                        }}
                        onClick={handlePaletteClick}
                        onTouchStart={() => setIsDragging(true)}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to bottom, transparent, black)',
                          }}
                        />
                        {/* Cursor indicator */}
                        <div
                          className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: cursorPosition.x,
                            top: cursorPosition.y,
                          }}
                        />
                      </div>
                      
                      {/* Cursor position display */}
                      <div className="mt-2 text-xs text-muted-foreground">
                        Cursor: ({Math.round(cursorPosition.x)}, {Math.round(cursorPosition.y)})
                      </div>
                    </div>

                    {/* Hue Slider */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Hue</label>
                      <div className="relative">
                        <div
                          ref={hueSliderRef}
                          className="w-full h-6 rounded-lg cursor-pointer border border-border relative"
                          style={{
                            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                          }}
                          onMouseDown={handleHueMouseDown}
                          onTouchStart={handleHueTouchStart}
                        >
                          {/* Slider Handle */}
                          <div
                            className="absolute top-0 w-4 h-6 bg-white border-2 border-gray-300 rounded-sm shadow-lg cursor-grab active:cursor-grabbing transform -translate-x-1/2 hover:scale-110 transition-transform"
                            style={{
                              left: `${(currentColor.hsl.h / 360) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Honeycomb Palette Mode */
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Color Palette</h3>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {Array.from({ length: 60 }, (_, i) => {
                        const hue = (i * 6) % 360;
                        const saturation = 70 + (i % 3) * 15;
                        const lightness = 40 + (i % 4) * 15;
                        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                        return (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-white transition-all duration-200 hover:scale-110"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              // Convert HSL to RGB
                              const h = hue / 360;
                              const s = saturation / 100;
                              const l = lightness / 100;
                              
                              let r, g, b;
                              if (s === 0) {
                                r = g = b = l;
                              } else {
                                const hue2rgb = (p: number, q: number, t: number) => {
                                  if (t < 0) t += 1;
                                  if (t > 1) t -= 1;
                                  if (t < 1/6) return p + (q - p) * 6 * t;
                                  if (t < 1/2) return q;
                                  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                                  return p;
                                };
                                
                                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                                const p = 2 * l - q;
                                r = hue2rgb(p, q, h + 1/3);
                                g = hue2rgb(p, q, h);
                                b = hue2rgb(p, q, h - 1/3);
                              }
                              
                              updateAllFormats({
                                r: Math.round(r * 255),
                                g: Math.round(g * 255),
                                b: Math.round(b * 255)
                              });
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Current Color Swatch */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border border-border shadow-inner"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Current Color</p>
                    <p className="text-xs text-muted-foreground">
                      RGB: {currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inline Ad */}
            <div className="my-8">
              <div className="bg-gray-800/30 rounded-lg p-4 text-center text-gray-400 border border-gray-600/30">
                <div className="h-20 sm:h-24 lg:h-28 flex items-center justify-center text-sm">
                  Inline Ad Area (728x90 / 320x100)
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Color Formats */}
          <div className="space-y-6">
            {/* Desktop Ad Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-gray-800/30 rounded-lg p-4 text-center text-gray-400 border border-gray-600/30 mb-6">
                <div className="h-32 flex items-center justify-center text-sm">
                  Sidebar Ad<br/>(300x250)
                </div>
              </div>
            </div>

            {/* Color Format Outputs */}
            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground">Color Formats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* HEX */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">HEX</label>
                  <div className="flex gap-2">
                    <Input
                      value={colorStrings.hex}
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target.value);
                        updateAllFormats(rgb);
                      }}
                      className="bg-background border-border text-foreground"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(colorStrings.hex, "HEX")}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* RGB */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">RGB</label>
                  <div className="flex gap-2">
                    <Input
                      value={colorStrings.rgb}
                      readOnly
                      className="bg-background border-border text-foreground"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(colorStrings.rgb, "RGB")}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* HSL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">HSL</label>
                  <div className="flex gap-2">
                    <Input
                      value={colorStrings.hsl}
                      readOnly
                      className="bg-background border-border text-foreground"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(colorStrings.hsl, "HSL")}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* HSV */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">HSV</label>
                  <div className="flex gap-2">
                    <Input
                      value={colorStrings.hsv}
                      readOnly
                      className="bg-background border-border text-foreground"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(colorStrings.hsv, "HSV")}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* CMYK */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">CMYK</label>
                  <div className="flex gap-2">
                    <Input
                      value={colorStrings.cmyk}
                      readOnly
                      className="bg-background border-border text-foreground"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(colorStrings.cmyk, "CMYK")}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* HTML Color Name */}
                {currentColor.htmlName && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">HTML Name</label>
                    <div className="flex gap-2">
                      <Input
                        value={colorStrings.htmlName}
                        readOnly
                        className="bg-background border-border text-foreground"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleCopyToClipboard(colorStrings.htmlName, "HTML Name")}
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Section */}
        <Card className="solid-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">What is the Utilitix Color Picker Tool?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The Utilitix Color Picker Tool is a free, all-in-one solution to select and convert colors in HEX, RGB, HSL, HSV, and CMYK formats. 
                Whether you're a designer, developer, or hobbyist, our advanced palette and spectrum tools help you find the perfect shade quickly and accurately. 
                It's ideal for web design, printing, UI/UX design, and more.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Features:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Dual picker modes: Palette and Color Wheel</li>
                    <li>• Real-time format conversion</li>
                    <li>• Copy-to-clipboard functionality</li>
                    <li>• Touch-screen optimized</li>
                    <li>• HTML color name detection</li>
                    <li>• Precise cursor positioning</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Supported Formats:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• HEX (#FF5733)</li>
                    <li>• RGB (rgb(255, 87, 51))</li>
                    <li>• HSL (hsl(14, 100%, 60%))</li>
                    <li>• HSV (hsv(14, 80%, 100%))</li>
                    <li>• CMYK (cmyk(0%, 66%, 80%, 0%))</li>
                    <li>• HTML color names (red, blue, etc.)</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm">
                <strong>Perfect for:</strong> Web developers, graphic designers, UI/UX designers, digital artists, and anyone working with colors in digital or print media.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ==================== BOTTOM AD AREA - START ==================== */}
        <div className="mt-8">
          {/* PASTE YOUR AD SCRIPT HERE */}
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : 'YOUR_AD_KEY_HERE',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
            `
          }} />
          {/* PASTE YOUR AD SCRIPT ABOVE */}
        </div>
        {/* ==================== BOTTOM AD AREA - END ==================== */}
      </div>
    </div>
  );
}