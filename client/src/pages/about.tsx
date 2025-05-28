import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundShapes from "@/components/background-shapes";
import AdsterraAd from "@/components/AdsterraAd";
import { ArrowLeftIcon, ImageIcon, FileIcon, TypeIcon, CodeIcon, MailIcon, MessageCircleIcon } from "lucide-react";

export default function About() {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About Us
              </span>
            </h1>
            <p className="text-gray-300 font-medium">Learn more about Utilitix and our mission</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          {/* Main Introduction */}
          <Card className="solid-card">
            <CardContent className="p-8">
              <p className="text-foreground text-lg leading-relaxed mb-6">
                Welcome to <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Utilitix</span> Powered by <span className="font-bold text-emerald-400">EnderHOST</span>, a free online platform offering a range of fast and easy-to-use digital tools. Whether you're editing text, converting files, or working with fonts and images, we aim to make your everyday tasks simpler and more efficient — no installation, registration, or cost required.
              </p>
            </CardContent>
          </Card>

          {/* Our Tools Section */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground text-xl flex items-center space-x-2">
                <span>🔧</span>
                <span>Our Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-6">Here's a quick overview of what you can do on our site:</p>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50">
                  <ImageIcon className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">🖼️ Image Converter & Resizer</h3>
                    <p className="text-muted-foreground text-sm">
                      Quickly convert images between formats (JPG, PNG, WebP, etc.) or resize them to fit your exact needs — perfect for web uploads, profile pictures, or compressed sharing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50">
                  <FileIcon className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">📁 File Type Changer</h3>
                    <p className="text-muted-foreground text-sm">
                      Instantly change the file extension or format of your files, from documents to multimedia. A lifesaver for compatibility across devices and platforms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50">
                  <TypeIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">🔤 Font Changer</h3>
                    <p className="text-muted-foreground text-sm">
                      Generate cool, aesthetic, or Unicode-styled text for social media bios, posts, and usernames. Express yourself with unique font styles in just one click.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50">
                  <CodeIcon className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">✏️ Text Editor</h3>
                    <p className="text-muted-foreground text-sm">
                      Use our lightweight, browser-based text editor to write, format, and modify content without needing any external software. Ideal for notes, scripts, or quick edits.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ==================== MIDDLE AD AREA - START ==================== */}
          <div className="my-8">
            <AdsterraAd 
              adKey="9713846a01389bccb7945a5638e800ae"
              width={728}
              height={90}
            />
          </div>
          {/* ==================== MIDDLE AD AREA - END ==================== */}

          {/* Our Mission */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground text-xl flex items-center space-x-2">
                <span>🙌</span>
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground text-lg leading-relaxed">
                We believe in building simple, reliable tools for everyone — from developers and designers to students and content creators. No clutter. No paywalls. Just clean functionality and a fast user experience.
              </p>
            </CardContent>
          </Card>

          {/* Get in Touch */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground text-xl flex items-center space-x-2">
                <span>📬</span>
                <span>Get in Touch</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">Have suggestions, questions, or run into an issue? We're here to help.</p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50">
                  <MailIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="font-semibold text-foreground">Support Email:</span>
                    <span className="text-muted-foreground ml-2">mail.enderhost@gmail.com</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50">
                  <MessageCircleIcon className="w-5 h-5 text-purple-400" />
                  <div>
                    <span className="font-semibold text-foreground">Discord:</span>
                    <a 
                      href="https://discord.gg/bsGPB9VpUY" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 ml-2 underline"
                    >
                      Join our community
                    </a>
                    <span className="text-muted-foreground ml-2">to ask questions or chat directly with our team.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Website Owner */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground text-xl flex items-center space-x-2">
                <span>👤</span>
                <span>Website Owner</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-foreground font-semibold text-lg">Tanumoy Maity</p>
                <p className="text-muted-foreground">Operating from: India</p>
              </div>
            </CardContent>
          </Card>

          {/* Closing Message */}
          <Card className="solid-card border-2 border-gradient-to-r from-blue-500 to-purple-500">
            <CardContent className="p-8 text-center">
              <p className="text-foreground text-lg font-medium">
                Thank you for using <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Utilitix</span> — we're constantly improving and adding new tools to serve you better.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ==================== BOTTOM AD AREA - START ==================== */}
        <div className="mt-8">
          <AdsterraAd 
            adKey="9713846a01389bccb7945a5638e800ae"
            width={728}
            height={90}
          />
        </div>
        {/* ==================== BOTTOM AD AREA - END ==================== */}
      </div>
    </div>
  );
}