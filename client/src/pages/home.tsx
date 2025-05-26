import { Button } from "@/components/ui/button";
import ToolCard from "@/components/tool-card";
import BackgroundShapes from "@/components/background-shapes";
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">Universal</span>
            <br />
            <span className="text-foreground">Web Tools</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Transform, convert, and create with our comprehensive suite of web-based tools. 
            Everything you need, all in one place, completely free.
          </p>
          
          <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
            <button 
              className="vibrant-button"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <RocketIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Explore Tools
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-400">7+</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Tools Available</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400">Client-Side</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Processing</div>
            </div>
            <div className="text-center">
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
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Professional-grade tools that work entirely in your browser. No uploads, no limits, no compromises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <ToolCard
              title="Image Resizer"
              description="Resize images instantly with drag-and-drop functionality. Maintain quality while optimizing file sizes."
              icon={ExpandIcon}
              href="/image-resizer"
              gradient="from-indigo-500 to-purple-600"
            />
            
            <ToolCard
              title="Image Converter"
              description="Convert between any image format - JPG, PNG, WEBP, GIF, and more. Lightning-fast conversion."
              icon={RefreshCwIcon}
              href="/image-converter"
              gradient="from-emerald-500 to-teal-600"
            />
            
            <ToolCard
              title="File Converter"
              description="Universal file format converter supporting documents, archives, and multimedia files."
              icon={FileTextIcon}
              href="/file-converter"
              gradient="from-amber-500 to-orange-600"
            />
            
            <ToolCard
              title="Temporary Email"
              description="Generate temporary email addresses with full inbox functionality. Perfect for testing and privacy."
              icon={MailIcon}
              href="/temp-email"
              gradient="from-blue-500 to-cyan-600"
            />
            
            <ToolCard
              title="Font Changer"
              description="Transform text with hundreds of beautiful fonts. Preview and apply typography styles instantly."
              icon={TypeIcon}
              href="/font-changer"
              gradient="from-pink-500 to-rose-600"
            />
            
            <ToolCard
              title="Code Notepad"
              description="Write, edit, and save code with syntax highlighting. Export in any format - JS, Python, HTML, CSS, and more."
              icon={CodeIcon}
              href="/code-notepad"
              gradient="from-violet-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">T</span>
                </div>
                <span className="text-xl font-bold gradient-text">ToolBox Pro</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Professional web tools that work entirely in your browser. Fast, secure, and completely free to use.
              </p>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/image-resizer" className="hover:text-foreground transition-colors">Image Resizer</a></li>
                <li><a href="/image-converter" className="hover:text-foreground transition-colors">Image Converter</a></li>
                <li><a href="/file-converter" className="hover:text-foreground transition-colors">File Converter</a></li>
                <li><a href="/temp-email" className="hover:text-foreground transition-colors">Temp Email</a></li>
                <li><a href="/font-changer" className="hover:text-foreground transition-colors">Font Changer</a></li>
                <li><a href="/code-notepad" className="hover:text-foreground transition-colors">Code Notepad</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ToolBox Pro. All rights reserved. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
