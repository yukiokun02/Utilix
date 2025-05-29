import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, Infinity } from "lucide-react";
import ToolCard from "@/components/tool-card";
import { 
  ImageIcon, 
  FileText, 
  Palette, 
  Type, 
  Archive, 
  Mail,
  Smartphone,
  Monitor,
  Crop,
  RotateCcw
} from "lucide-react";
import BackgroundShapes from "@/components/background-shapes";
import EnderHostFooter from "@/components/enderhost-footer";
import AdsterraAdMobile from "@/components/AdsterraAdMobile";
import AdsterraAdDesktop from "@/components/AdsterraAdDesktop";

const tools = [
  {
    title: "Image Resizer",
    description: "Resize, crop, and optimize your images with advanced editing tools",
    icon: ImageIcon,
    href: "/image-resizer",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    title: "File Converter", 
    description: "Convert between different file formats easily and quickly",
    icon: FileText,
    href: "/file-converter",
    gradient: "from-green-500 to-teal-600"
  },
  {
    title: "Color Picker",
    description: "Pick colors from images and get hex, RGB, and HSL values",
    icon: Palette,
    href: "/color-picker", 
    gradient: "from-pink-500 to-rose-600"
  },
  {
    title: "Font Changer",
    description: "Transform your text with beautiful fonts and styling options",
    icon: Type,
    href: "/font-changer",
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "File Compressor",
    description: "Compress files and reduce their size without losing quality",
    icon: Archive,
    href: "/file-compressor",
    gradient: "from-indigo-500 to-blue-600"
  },
  {
    title: "Temp Email",
    description: "Generate temporary email addresses for privacy and testing",
    icon: Mail,
    href: "/temp-email",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    title: "Code Notepad",
    description: "Write, edit, and format code with syntax highlighting",
    icon: FileText,
    href: "/code-notepad",
    gradient: "from-emerald-500 to-green-600"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <BackgroundShapes variant="hero" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* ==================== TOP AD AREA - START ==================== */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-4xl">
                <AdsterraAdMobile />
                <AdsterraAdDesktop />
              </div>
            </div>
          </div>
          {/* ==================== TOP AD AREA - END ==================== */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-scale mt-32 lg:mt-0">
            <span className="gradient-text">UTILITIX</span>
            <br />
            <span className="text-gray-300">All-in-One</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Your ultimate collection of powerful online tools. Convert files, edit images, pick colors, and much more - all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-slide-up stagger-2">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg hover:scale-105"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Explore Tools
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-16 sm:mb-20">
            <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 animate-slide-up stagger-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Lightning Fast</h3>
                <p className="text-xs text-gray-400">Processing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105 animate-slide-up stagger-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">100% Secure</h3>
                <p className="text-xs text-gray-400">& Private</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 animate-slide-up stagger-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">∞</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No Limits</h3>
                <p className="text-xs text-gray-400">Usage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-10 sm:py-16 md:py-20 relative">
        <BackgroundShapes variant="tools" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 gradient-text animate-fade-scale">
              Powerful Tools at Your Fingertips
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
              Everything you need to work with files, images, colors, and more. Professional-grade tools that are completely free to use.
            </p>
          </div>

          {/* ==================== MIDDLE AD AREA - START ==================== */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="mb-8 flex justify-center">
              <div className="w-full max-w-4xl">
                <AdsterraAdMobile />
                <AdsterraAdDesktop />
              </div>
            </div>
          </div>
          {/* ==================== MIDDLE AD AREA - END ==================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {tools.map((tool, index) => (
              <div key={tool.title} className={`animate-slide-up stagger-${index + 2}`}>
                <ToolCard {...tool} />
              </div>
            ))}
          </div>

          {/* ==================== BOTTOM AD AREA - START ==================== */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-4xl">
                <AdsterraAdMobile />
                <AdsterraAdDesktop />
              </div>
            </div>
          </div>
          {/* ==================== BOTTOM AD AREA - END ==================== */}
        </div>
      </section>

      <EnderHostFooter />
    </div>
  );
}