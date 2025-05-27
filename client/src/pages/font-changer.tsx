import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import BackgroundShapes from "@/components/background-shapes";
import DownloadPopup from "@/components/download-popup";
import { ArrowLeftIcon, TypeIcon, CopyIcon, CodeIcon, DownloadIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const FONT_FAMILIES = [
  { value: 'serif', label: 'Serif', css: 'serif' },
  { value: 'sans-serif', label: 'Sans Serif', css: 'sans-serif' },
  { value: 'monospace', label: 'Monospace', css: 'monospace' },
  { value: 'cursive', label: 'Cursive', css: 'cursive' },
  { value: 'fantasy', label: 'Fantasy', css: 'fantasy' },
  { value: 'inter', label: 'Inter', css: '"Inter", sans-serif' },
  { value: 'roboto', label: 'Roboto', css: '"Roboto", sans-serif' },
  { value: 'open-sans', label: 'Open Sans', css: '"Open Sans", sans-serif' },
  { value: 'lato', label: 'Lato', css: '"Lato", sans-serif' },
  { value: 'montserrat', label: 'Montserrat', css: '"Montserrat", sans-serif' },
  { value: 'poppins', label: 'Poppins', css: '"Poppins", sans-serif' },
  { value: 'nunito', label: 'Nunito', css: '"Nunito", sans-serif' },
  { value: 'source-sans', label: 'Source Sans Pro', css: '"Source Sans Pro", sans-serif' },
  { value: 'playfair', label: 'Playfair Display', css: '"Playfair Display", serif' },
  { value: 'merriweather', label: 'Merriweather', css: '"Merriweather", serif' },
  { value: 'fira-code', label: 'Fira Code', css: '"Fira Code", monospace' },
  { value: 'source-code', label: 'Source Code Pro', css: '"Source Code Pro", monospace' },
];

const FONT_WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
];

const FONT_STYLES = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
  { value: 'oblique', label: 'Oblique' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

export default function FontChanger() {
  const [text, setText] = useState("Transform your text with beautiful fonts!");
  const [fontFamily, setFontFamily] = useState('inter');
  const [fontSize, setFontSize] = useState([16]);
  const [fontWeight, setFontWeight] = useState('400');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textTransform, setTextTransform] = useState('none');
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{url: string, filename: string} | null>(null);
  const { toast } = useToast();

  const selectedFont = FONT_FAMILIES.find(f => f.value === fontFamily);
  
  const previewStyle = {
    fontFamily: selectedFont?.css || 'serif',
    fontSize: `${fontSize[0]}px`,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textTransform: textTransform as any,
    lineHeight: lineHeight[0],
    letterSpacing: `${letterSpacing[0]}px`,
  };

  const generateCSS = () => {
    return `font-family: ${selectedFont?.css || 'serif'};
font-size: ${fontSize[0]}px;
font-weight: ${fontWeight};
font-style: ${fontStyle};
text-transform: ${textTransform};
line-height: ${lineHeight[0]};
letter-spacing: ${letterSpacing[0]}px;`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Text Copied!",
        description: "Styled text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      });
    }
  };

  const handleCopyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      toast({
        title: "CSS Copied!",
        description: "Font styles copied as CSS",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy CSS",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const styledText = `
      <html>
      <head>
        <style>
          body {
            font-family: ${selectedFont?.css || 'serif'};
            font-size: ${fontSize[0]}px;
            font-weight: ${fontWeight};
            font-style: ${fontStyle};
            text-transform: ${textTransform};
            line-height: ${lineHeight[0]};
            letter-spacing: ${letterSpacing[0]}px;
            margin: 20px;
          }
        </style>
      </head>
      <body>
        ${text.replace(/\n/g, '<br>')}
      </body>
      </html>
    `;
    
    const blob = new Blob([styledText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPendingDownload({ url, filename: 'styled-text.html' });
    setShowDownloadPopup(true);
  };

  const executeDownload = () => {
    if (pendingDownload) {
      const link = document.createElement('a');
      link.href = pendingDownload.url;
      link.download = pendingDownload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pendingDownload.url);
      setPendingDownload(null);
      
      toast({
        title: "Downloaded!",
        description: "Styled text saved as HTML file",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      {/* Top Ad Banner */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gray-800/30 rounded-lg p-3 text-center text-gray-400 border border-gray-600/30 mb-6">
          <div className="h-16 sm:h-20 flex items-center justify-center text-xs sm:text-sm">
            Top Ad Banner (728x90 / 320x50)
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Font Changer
              </span>
            </h1>
            <p className="text-gray-300 font-medium text-sm sm:text-base">Transform text with beautiful fonts and typography styles</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-center">
            <Link href="/">
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* How to Use Section */}
        <Card className="solid-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enter your text, choose a font family, adjust styling options, and copy the styled text or CSS code.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Font Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your Text</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-background border-border text-foreground"
                  placeholder="Enter your text here..."
                  rows={3}
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Font Family</label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.css }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Font Size: {fontSize[0]}px
                </label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={72}
                  min={8}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Font Weight */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Font Weight</label>
                <Select value={fontWeight} onValueChange={setFontWeight}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHTS.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Style */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Font Style</label>
                <Select value={fontStyle} onValueChange={setFontStyle}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Text Transform */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Text Transform</label>
                <Select value={textTransform} onValueChange={setTextTransform}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXT_TRANSFORMS.map((transform) => (
                      <SelectItem key={transform.value} value={transform.value}>
                        {transform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Line Height */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Line Height: {lineHeight[0]}
                </label>
                <Slider
                  value={lineHeight}
                  onValueChange={setLineHeight}
                  max={3}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Letter Spacing */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Letter Spacing: {letterSpacing[0]}px
                </label>
                <Slider
                  value={letterSpacing}
                  onValueChange={setLetterSpacing}
                  max={10}
                  min={-2}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleCopyText}
                  className="flex-1 pill-button bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
                <Button 
                  onClick={handleCopyCSS}
                  variant="outline"
                  className="flex-1"
                >
                  <CodeIcon className="w-4 h-4 mr-2" />
                  Copy CSS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Middle Ad Between Font Control and Live Preview */}
          <div className="my-8">
            <div className="bg-gray-800/30 rounded-lg p-4 text-center text-gray-400 border border-gray-600/30">
              <div className="h-24 flex items-center justify-center text-sm">
                Middle Ad Area (728x90)
              </div>
            </div>
          </div>

          {/* Preview */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-xl p-6 bg-background min-h-[300px] flex items-center justify-center">
                <div 
                  style={previewStyle}
                  className="text-center break-words text-foreground"
                >
                  {text}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2">Generated CSS:</h3>
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
                  {generateCSS()}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="solid-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">About Font Changer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The Font Changer tool helps you experiment with typography and create beautifully styled text. 
                Perfect for designers, developers, and content creators who want to preview font combinations and generate CSS code.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Features:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• 17+ professional font families</li>
                    <li>• Complete typography controls</li>
                    <li>• Real-time preview updates</li>
                    <li>• Copy styled text instantly</li>
                    <li>• Generate ready-to-use CSS code</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Perfect For:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Web design projects</li>
                    <li>• Social media content</li>
                    <li>• Typography experiments</li>
                    <li>• CSS code generation</li>
                    <li>• Font combination testing</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm">
                <strong>Tip:</strong> Use the Copy CSS button to get the complete CSS code for your typography settings. 
                This makes it easy to apply the same styling to your websites and projects.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Ad */}
        <div className="mt-8">
          <div className="bg-gray-800/30 rounded-lg p-4 text-center text-gray-400 border border-gray-600/30">
            <div className="h-24 flex items-center justify-center text-sm">
              Bottom Ad Area (728x90)
            </div>
          </div>
        </div>
      </div>

      {/* Download Popup */}
      <DownloadPopup
        isOpen={showDownloadPopup}
        onClose={() => setShowDownloadPopup(false)}
        onDownload={executeDownload}
        filename={pendingDownload?.filename || "styled-text.html"}
      />
    </div>
  );
}