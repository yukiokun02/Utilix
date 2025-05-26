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
  CodeIcon 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <BackgroundShapes variant="hero" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-scale">
            <span className="gradient-text">Universal</span>
            <br />
            <span className="text-foreground">Web Tools</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 animate-slide-up stagger-1 font-medium">
            Transform, convert, and create with our comprehensive suite of web-based tools. 
            Everything you need, all in one place, completely free.
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
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-400">7+</div>
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
                title="Image Resizer/Converter"
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
                title="Temporary Email"
                description="Generate temporary email addresses with full inbox functionality. Perfect for testing and privacy."
                icon={MailIcon}
                href="/temp-email"
                gradient="from-blue-500 to-cyan-600"
              />
            </div>
            
            <div className="animate-slide-up stagger-5 hover-lift">
              <ToolCard
                title="Font Changer"
                description="Transform text with hundreds of beautiful fonts. Preview and apply typography styles instantly."
                icon={TypeIcon}
                href="/font-changer"
                gradient="from-pink-500 to-rose-600"
              />
            </div>
            
            <div className="animate-slide-up stagger-6 hover-lift">
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
