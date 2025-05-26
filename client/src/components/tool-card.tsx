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
    <div className={`${getCardClass(gradient)} group cursor-pointer p-6`}>
      <div className="colorful-icon-button mb-4 inline-block">
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-white transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">
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
