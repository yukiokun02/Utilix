import { Link, useLocation } from "wouter";
import { MenuIcon, ChevronDownIcon, FileIcon, MailIcon, TypeIcon, CodeIcon, ExpandIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  const tools = [
    { name: "Image Resizer/Converter", icon: ExpandIcon, href: "/image-resizer" },
    { name: "FileType Changer", icon: FileIcon, href: "/file-converter" },
    { name: "Temp Email", icon: MailIcon, href: "/temp-email" },
    { name: "Font Changer", icon: TypeIcon, href: "/font-changer" },
    { name: "Text Editor", icon: CodeIcon, href: "/code-notepad" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-base sm:text-lg md:text-xl font-black gradient-text tracking-wide">Utilitix</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <div className="relative">
              <button 
                className="vibrant-button-secondary text-sm font-bold flex items-center space-x-2 hover:brightness-110 active:scale-95 transition-all duration-200"
                onMouseEnter={() => setIsToolsDropdownOpen(true)}
                onMouseLeave={() => setIsToolsDropdownOpen(false)}
              >
                <span>Tools</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isToolsDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 vibrant-card rounded-xl shadow-2xl border-2 border-white/20 animate-slide-down origin-top"
                  onMouseEnter={() => setIsToolsDropdownOpen(true)}
                  onMouseLeave={() => setIsToolsDropdownOpen(false)}
                >
                  <div className="p-2">
                    {tools.map((tool, index) => (
                      <Link key={index} href={tool.href}>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer transform">
                          <tool.icon className="w-4 h-4 text-white" />
                          <span className="text-sm font-semibold text-white">{tool.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/donate">
              <button className="vibrant-button text-sm font-bold hover:brightness-110 active:scale-95 transition-all duration-200">
                <span>Donate Us</span>
              </button>
            </Link>
          </div>
          
          <button
            className="colorful-icon-button md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="w-4 h-4 text-white font-bold" />
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <div className="vibrant-card rounded-xl p-3">
                <h3 className="text-sm font-bold text-white mb-3">Tools</h3>
                <div className="space-y-2">
                  {tools.map((tool, index) => (
                    <Link key={index} href={tool.href}>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                        <tool.icon className="w-4 h-4 text-white" />
                        <span className="text-sm font-semibold text-white">{tool.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link href="/donate">
                <button className="vibrant-button w-full font-bold" onClick={() => setIsMenuOpen(false)}>
                  <span>Donate Us</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
