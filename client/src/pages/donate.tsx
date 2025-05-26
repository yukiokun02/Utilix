import { HeartIcon, CoffeeIcon, StarIcon, GiftIcon } from "lucide-react";
import BackgroundShapes from "@/components/background-shapes";

export default function Donate() {
  const donationAmounts = [
    { amount: 5, label: "Coffee", icon: CoffeeIcon, description: "Buy us a coffee" },
    { amount: 10, label: "Support", icon: HeartIcon, description: "Show your support" },
    { amount: 25, label: "Boost", icon: StarIcon, description: "Boost development" },
    { amount: 50, label: "Sponsor", icon: GiftIcon, description: "Become a sponsor" },
  ];

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <BackgroundShapes variant="hero" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-scale">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="colorful-icon-button">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">
                Support Utilitix
              </h1>
            </div>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Help us keep Utilitix free and continuously improve our tools. Your support enables us to 
            add new features, maintain servers, and provide the best user experience.
          </p>

          {/* Donation Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {donationAmounts.map((option, index) => (
              <div 
                key={index}
                className="vibrant-card group cursor-pointer hover-lift animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="colorful-icon-button mb-3 mx-auto">
                    <option.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    ${option.amount}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mb-2">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-400">
                    {option.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-8 sm:mb-12 animate-slide-up stagger-3">
            <div className="vibrant-card max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white mb-4">Custom Amount</h3>
              <div className="flex items-center space-x-3">
                <span className="text-white text-lg">$</span>
                <input 
                  type="number"
                  placeholder="Enter amount"
                  className="vibrant-input flex-1 text-center"
                  min="1"
                />
                <button className="vibrant-button-secondary">
                  Donate
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="animate-slide-up stagger-4">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Choose Your Payment Method</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="vibrant-button hover-glow">
                PayPal
              </button>
              <button className="vibrant-button hover-glow">
                Credit Card
              </button>
              <button className="vibrant-button hover-glow">
                Crypto
              </button>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-12 sm:mt-16 animate-slide-up stagger-5">
            <div className="vibrant-card">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                Thank You for Your Support! 💙
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                Every donation, no matter the size, helps us maintain and improve Utilitix. 
                You're helping keep these tools free for everyone!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}