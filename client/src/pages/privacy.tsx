import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon } from "lucide-react";

export default function Privacy() {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      {/* Top Ad Banner */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gray-800/30 rounded-lg p-3 text-center text-gray-400 border border-gray-600/30 mb-6">
          <div className="h-16 sm:h-20 lg:h-24 flex items-center justify-center text-xs sm:text-sm">
            Top Ad Banner (728x90 / 320x50)
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                🔒 Privacy Policy
              </span>
            </h1>
            <p className="text-gray-300 font-medium text-sm sm:text-base">How we protect and handle your information</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-center">
            <Link href="/">
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Card className="solid-card">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <div className="mb-6">
              <p className="text-muted-foreground">
                <strong>Effective Date:</strong> {today}
              </p>
            </div>

            <div className="space-y-8 text-foreground">
              <p className="text-lg leading-relaxed">
                Utilitix respects your privacy. This Privacy Policy outlines how we collect, use, and protect your information.
              </p>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">1. Information We Collect</h2>
                <ul className="space-y-3 leading-relaxed ml-6">
                  <li><strong>Personal Info:</strong> Name, email (only when voluntarily submitted).</li>
                  <li><strong>Usage Data:</strong> IP address, browser type, device info, and pages visited.</li>
                  <li><strong>Cookies:</strong> We use cookies to improve functionality and user experience.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">2. How We Use Your Information</h2>
                <ul className="space-y-2 leading-relaxed ml-6">
                  <li>To provide and maintain our services.</li>
                  <li>To analyze website performance.</li>
                  <li>To improve user experience.</li>
                  <li>To serve ads through third-party partners (e.g., Google AdSense and other verified Ad Websites).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">3. Google AdSense & Cookies</h2>
                <p className="leading-relaxed">
                  Third-party vendors, including Google, use cookies to serve ads. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this and other websites. You can opt out via Google's Ad Settings.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">4. Sharing Your Information</h2>
                <p className="leading-relaxed">
                  We do <strong>not</strong> sell or trade your personal information. We may share information with trusted partners for website functionality and analytics.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">5. Security</h2>
                <p className="leading-relaxed">
                  We implement reasonable security measures to protect your information. However, no method of transmission is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">6. Your Choices</h2>
                <p className="leading-relaxed">
                  You can disable cookies through your browser settings.
                </p>
              </section>

              {/* ==================== MIDDLE AD AREA - START ==================== */}
              <div className="my-8">
                {/* PASTE YOUR AD SCRIPT HERE */}
                <div dangerouslySetInnerHTML={{
                  __html: `
                    <script type="text/javascript">
                      atOptions = {
                        'key' : 'YOUR_AD_KEY_HERE',
                        'format' : 'iframe',
                        'height' : 90,
                        'width' : 728,
                        'params' : {}
                      };
                    </script>
                    <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
                  `
                }} />
                {/* PASTE YOUR AD SCRIPT ABOVE */}
              </div>
              {/* ==================== MIDDLE AD AREA - END ==================== */}

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">7. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this policy. Please check this page regularly.
                </p>
              </section>

              <div className="mt-12 p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-center text-muted-foreground">
                  For privacy-related questions, please contact us at 
                  <span className="text-emerald-400 ml-1">mail.enderhost@gmail.com</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ==================== BOTTOM AD AREA - START ==================== */}
        <div className="mt-8">
          {/* PASTE YOUR AD SCRIPT HERE */}
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : 'YOUR_AD_KEY_HERE',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
            `
          }} />
          {/* PASTE YOUR AD SCRIPT ABOVE */}
        </div>
        {/* ==================== BOTTOM AD AREA - END ==================== */}
      </div>
    </div>
  );
}