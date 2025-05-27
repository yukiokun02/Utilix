import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon } from "lucide-react";

export default function Terms() {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                📄 Terms of Use
              </span>
            </h1>
            <p className="text-gray-300 font-medium text-sm sm:text-base">Please read our terms and conditions</p>
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
                Welcome to Utilitix! By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.
              </p>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-400">1. Use of the Website</h2>
                <p className="leading-relaxed">
                  You agree to use this website only for lawful purposes. You must not misuse or interfere with the website or attempt to access it using any method other than the interface and instructions we provide.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-400">2. Intellectual Property</h2>
                <p className="leading-relaxed">
                  All content, logos, and materials on this website are owned by or licensed to Utilitix. Unauthorized use or duplication is prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-400">3. User-Generated Content</h2>
                <p className="leading-relaxed">
                  If users can submit content (e.g., comments or reviews), you are responsible for what you post. We reserve the right to remove content that is offensive, illegal, or violates our policies.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-400">4. Third-Party Links</h2>
                <p className="leading-relaxed">
                  We may include links to third-party websites. We are not responsible for their content or privacy practices.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-400">5. Disclaimer of Warranties</h2>
                <p className="leading-relaxed">
                  All tools and information are provided "as is" without any warranty. We do not guarantee accuracy, reliability, or availability of services.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-400">6. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  We are not liable for any direct, indirect, or incidental damages resulting from your use or inability to use this website.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-400">7. Changes to These Terms</h2>
                <p className="leading-relaxed">
                  We may update these Terms from time to time. Continued use of the website means you accept the revised Terms.
                </p>
              </section>

              <div className="mt-12 p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-center text-muted-foreground">
                  If you have any questions about these Terms of Use, please contact us at 
                  <span className="text-blue-400 ml-1">mail.enderhost@gmail.com</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}