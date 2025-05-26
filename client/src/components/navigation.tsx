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
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Hammer className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ToolBox Pro</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`transition-colors ${location === '/' ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}>
              Home
            </Link>
            <Link href="/#tools" className="text-muted-foreground hover:text-foreground transition-colors">
              Tools
            </Link>
            <Button className="pill-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              Get Started
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/#tools" className="text-muted-foreground hover:text-foreground transition-colors">
                Tools
              </Link>
              <Button className="pill-button bg-gradient-to-r from-indigo-500 to-purple-600 w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
