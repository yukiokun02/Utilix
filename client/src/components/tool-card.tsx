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
  return (
    <Card className="tool-card group">
      <CardContent className="p-6">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Link href={href}>
          <Button className={`w-full pill-button bg-gradient-to-r ${gradient} hover:shadow-lg transition-all duration-300`}>
            Open Tool
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
