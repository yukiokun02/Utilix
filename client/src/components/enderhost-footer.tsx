import { ServerIcon, ZapIcon, DollarSignIcon, MessageCircleIcon, ExternalLinkIcon } from "lucide-react";

export default function EnderHostFooter() {
  const features = [
    {
      icon: ZapIcon,
      title: "Low Latency",
      description: "Indian Servers"
    },
    {
      icon: DollarSignIcon,
      title: "Competitive",
      description: "Pricing"
    },
    {
      icon: ServerIcon,
      title: "High Performance",
      description: "Servers"
    }
  ];

  return (
    <footer className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-gray-900/50 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-10 left-10 w-32 h-32 rounded-full floating-element"
          style={{
            background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)",
            opacity: 0.4,
            filter: "blur(2px)",
            animationDelay: "0s"
          }}
        />
        <div 
          className="absolute bottom-10 right-10 w-24 h-24 rounded-full floating-element"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            opacity: 0.5,
            filter: "blur(2px)",
            animationDelay: "2s"
          }}
        />
        <div 
          className="absolute top-1/2 right-1/4 w-20 h-20 rounded-xl transform rotate-45 floating-element"
          style={{
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            opacity: 0.6,
            filter: "blur(1px)",
            animationDelay: "4s"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="colorful-icon-button">
              <ServerIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black gradient-text">
              Need Minecraft Hosting?
            </h2>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8">
            Power your Minecraft server with <span className="font-bold text-emerald-400">EnderHOST</span> - 
            India's premium Minecraft hosting provider with lightning-fast servers and unbeatable support.
          </p>

          {/* Features Grid */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="https://www.enderhost.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="vibrant-button w-full sm:w-auto animate-pulse-subtle"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              <span>Visit EnderHOST</span>
            </a>
            
            <a 
              href="https://discord.gg/bsGPB9VpUY" 
              target="_blank" 
              rel="noopener noreferrer"
              className="vibrant-button-secondary w-full sm:w-auto animate-bounce-subtle"
            >
              <MessageCircleIcon className="w-4 h-4" />
              <span>Join Discord</span>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">
                © 2024 <span className="font-bold gradient-text">Utilitix</span>. All rights reserved.
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Powered by <a 
                  href="https://www.enderhost.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  EnderHOST
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}