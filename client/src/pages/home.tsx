import { Button } from "@/components/ui/button";
import ToolCard from "@/components/tool-card";
import BackgroundShapes from "@/components/background-shapes";
import EnderHostFooter from "@/components/enderhost-footer";
import { 
  RocketIcon, 
  PlayIcon, 
  ExpandIcon, 
  RefreshCwIcon, 
  FileTextIcon, 
  MailIcon, 
  TypeIcon, 
  CodeIcon,
  ZapIcon,
  ShieldIcon,
  SmartphoneIcon,
  GlobeIcon
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <BackgroundShapes variant="hero" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-scale">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center animate-slide-up stagger-3 hover-lift">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-400">6+</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Tools Available</div>
            </div>
            <div className="text-center animate-slide-up stagger-4 hover-lift">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Free to Use</div>
            </div>
            <div className="text-center animate-slide-up stagger-5 hover-lift">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400">Client-Side</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Processing</div>
            </div>
            <div className="text-center animate-slide-up stagger-6 hover-lift">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400">No Limits</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Usage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-background to-gray-900/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-10 left-10 w-32 h-32 rounded-full floating-element"
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              opacity: 0.3,
              filter: "blur(2px)",
              animationDelay: "0s"
            }}
          />
          <div 
            className="absolute bottom-10 right-10 w-24 h-24 rounded-full floating-element"
            style={{
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              opacity: 0.4,
              filter: "blur(2px)",
              animationDelay: "2s"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text mb-4">
              Why Choose Utilitix?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto font-medium">
              Experience the perfect blend of power and simplicity with our feature-rich toolkit
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <div className="flex items-center space-x-4 bg-gray-800/50 rounded-lg px-6 py-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <ZapIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Lightning Fast</h3>
                <p className="text-xs text-gray-400">Instant Processing</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-800/50 rounded-lg px-6 py-4 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">100% Secure</h3>
                <p className="text-xs text-gray-400">No Data Upload</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-800/50 rounded-lg px-6 py-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <SmartphoneIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Mobile Friendly</h3>
                <p className="text-xs text-gray-400">Works Everywhere</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-800/50 rounded-lg px-6 py-4 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <GlobeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Always Free</h3>
                <p className="text-xs text-gray-400">No Hidden Costs</p>
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
            
            <div className="animate-slide-up stagger-5 hover-lift">
              <ToolCard
                title="Text Editor"
                description="Write, edit, and save text with syntax highlighting. Export in any format - JS, Python, HTML, CSS, and more."
                icon={CodeIcon}
                href="/code-notepad"
                gradient="from-violet-500 to-purple-600"
              />
            </div>
          </div>
        </div>
      </section>

      <EnderHostFooter />
    </div>
  );
}
