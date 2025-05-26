import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Hammer, MenuIcon } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="colorful-icon-button">
              <Hammer className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold gradient-text">ToolBox Pro</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <button className="vibrant-button-secondary text-sm">
              Tools
            </button>
            <button className="vibrant-button-secondary text-sm">
              Support Us
            </button>
          </div>
          
          <button
            className="colorful-icon-button md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <button className="vibrant-button-secondary text-sm w-full" onClick={() => setIsMenuOpen(false)}>
                Tools
              </button>
              <button className="vibrant-button-secondary text-sm w-full" onClick={() => setIsMenuOpen(false)}>
                Support Us
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
