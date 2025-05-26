import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

export default function ToolCard({ title, description, icon: Icon, href, gradient }: ToolCardProps) {
  // Map different gradients to different vibrant card classes
  const getCardClass = (gradient: string) => {
    if (gradient.includes('indigo')) return 'tool-card-1';
    if (gradient.includes('emerald')) return 'tool-card-2';
    if (gradient.includes('pink')) return 'tool-card-3';
    if (gradient.includes('purple')) return 'tool-card-4';
    if (gradient.includes('amber')) return 'tool-card-5';
    return 'tool-card-6';
  };

  return (
    <div className={`${getCardClass(gradient)} group cursor-pointer`}>
      <div className="colorful-icon-button mb-3 sm:mb-4 inline-flex items-center justify-center">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white font-bold" strokeWidth={2.5} />
      </div>
      
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-white transition-colors">
        {title}
      </h3>
      
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6 group-hover:text-gray-200 transition-colors">
        {description}
      </p>
      
      <Link href={href}>
        <button className="vibrant-button-secondary w-full">
          Open Tool
        </button>
      </Link>
    </div>
  );
}
