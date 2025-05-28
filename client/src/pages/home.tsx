import { Button } from "@/components/ui/button";
import ToolCard from "@/components/tool-card";
import BackgroundShapes from "@/components/background-shapes";
import EnderHostFooter from "@/components/enderhost-footer";
import AdsterraAd from "@/components/AdsterraAd";
import { 
  RocketIcon, 
  PlayIcon, 
  ExpandIcon, 
  RefreshCwIcon, 
  FileTextIcon, 
  MailIcon, 
  TypeIcon, 
  CodeIcon,
  PaletteIcon,
  ZapIcon,
  ShieldIcon,
  SmartphoneIcon,
  GlobeIcon,
  FileArchiveIcon
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <BackgroundShapes variant="hero" />
        
        {/* ==================== MOBILE TOP AD AREA - START ==================== */}
        <div className="absolute top-20 left-4 right-4 z-20 block lg:hidden">
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : '9713846a01389bccb7945a5638e800ae',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/9713846a01389bccb7945a5638e800ae/invoke.js"></script>
            `
          }} />
        </div>
        {/* ==================== MOBILE TOP AD AREA - END ==================== */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* ==================== DESKTOP TOP AD AREA - START ==================== */}
          <div className="hidden lg:block mb-8">
            <div dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript">
                  atOptions = {
                    'key' : '9713846a01389bccb7945a5638e800ae',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/9713846a01389bccb7945a5638e800ae/invoke.js"></script>
              `
            }} />
          </div>
          {/* ==================== DESKTOP TOP AD AREA - END ==================== */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-scale mt-32 lg:mt-0">
            <span className="gradient-text">UTILITIX</span>
            <br />
            <span className="text-foreground">Free Online Tools for Everyday Tasks</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 animate-slide-up stagger-1 font-medium">
            Convert, resize, crop, edit, text editor, change font and generate with powerful tools – all in one place, 100% free and mobile-friendly.
          </p>
          
          <div className="flex justify-center mb-8 sm:mb-12 md:mb-16 animate-slide-up stagger-2">
            <button 
              className="vibrant-button hover-glow animate-heartbeat"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <RocketIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Explore Tools</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 animate-slide-up stagger-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">7+</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tools Available</h3>
                <p className="text-xs text-gray-400">Ready to Use</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 animate-slide-up stagger-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">100%</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Free to Use</h3>
                <p className="text-xs text-gray-400">Always Free</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 animate-slide-up stagger-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <ZapIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Client-Side</h3>
                <p className="text-xs text-gray-400">Processing</p>
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
          {/* ==================== MOBILE MIDDLE AD AREA - START ==================== */}
          <div className="block lg:hidden mb-8">
            <div dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript">
                  atOptions = {
                    'key' : '9713846a01389bccb7945a5638e800ae',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/9713846a01389bccb7945a5638e800ae/invoke.js"></script>
              `
            }} />
          </div>
          {/* ==================== MOBILE MIDDLE AD AREA - END ==================== */}
          
          {/* ==================== DESKTOP MIDDLE AD AREA - START ==================== */}
          <div className="hidden lg:block mb-8">
            <div dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript">
                  atOptions = {
                    'key' : '9713846a01389bccb7945a5638e800ae',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/9713846a01389bccb7945a5638e800ae/invoke.js"></script>
              `
            }} />
          </div>
          {/* ==================== DESKTOP MIDDLE AD AREA - END ==================== */}
          
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful Tools
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4 font-medium">
              Professional-grade tools that work entirely in your browser. No uploads, no limits, no compromises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="animate-slide-up stagger-1 hover-lift">
              <ToolCard
                title="Image Tool"
                description="Resize, crop, convert, and optimize images with advanced tools. Support for all formats with quality control."
                icon={ExpandIcon}
                href="/image-resizer"
                gradient="from-indigo-500 to-purple-600"
              />
            </div>
            
            <div className="animate-slide-up stagger-2 hover-lift">
              <ToolCard
                title="FileType Changer"
                description="Universal file format converter supporting documents, archives, and multimedia files."
                icon={FileTextIcon}
                href="/file-converter"
                gradient="from-emerald-500 to-teal-600"
              />
            </div>
            
            <div className="animate-slide-up stagger-4 hover-lift">
              <ToolCard
                title="Font Changer"
                description="Transform text with hundreds of beautiful fonts. Preview and apply typography styles instantly."
                icon={TypeIcon}
                href="/font-changer"
                gradient="from-pink-500 to-rose-600"
              />
            </div>
            
            <div className="animate-slide-up stagger-4 hover-lift">
              <ToolCard
                title="File Compressor"
                description="Compress multiple files into ZIP, 7ZIP, TAR.GZ archives. Add password protection for secure file sharing."
                icon={FileArchiveIcon}
                href="/file-compressor"
                gradient="from-orange-500 to-red-600"
              />
            </div>
            
            <div className="animate-slide-up stagger-5 hover-lift">
              <ToolCard
                title="Text Editor"
                description="Write, edit, and save text with syntax highlighting. Export in any format - JS, Python, HTML, CSS, and more."
                icon={CodeIcon}
                href="/code-notepad"
                gradient="from-violet-500 to-purple-600"
              />
            </div>
            
            <div className="animate-slide-up stagger-6 hover-lift">
              <ToolCard
                title="Color Picker"
                description="Pick and convert colors in HEX, RGB, HSL, HSV, and CMYK formats"
                icon={PaletteIcon}
                href="/color-picker"
                gradient="from-purple-500 to-pink-600"
              />
            </div>
          </div>
        </div>
      </section>

      <EnderHostFooter />
    </div>
  );
}
