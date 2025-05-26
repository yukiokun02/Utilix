import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, TypeIcon, CopyIcon, DownloadIcon } from "lucide-react";
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
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet.");
  const [fontFamily, setFontFamily] = useState("inter");
  const [fontSize, setFontSize] = useState([16]);
  const [fontWeight, setFontWeight] = useState("400");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textTransform, setTextTransform] = useState("none");
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const { toast } = useToast();

  const getPreviewStyle = () => {
    const selectedFont = FONT_FAMILIES.find(f => f.value === fontFamily);
    return {
      fontFamily: selectedFont?.css || 'sans-serif',
      fontSize: `${fontSize[0]}px`,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      textTransform: textTransform as any,
      lineHeight: lineHeight[0],
      letterSpacing: `${letterSpacing[0]}px`,
    };
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "CSS styles copied successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const generateCSS = () => {
    const selectedFont = FONT_FAMILIES.find(f => f.value === fontFamily);
    return `.custom-text {
  font-family: ${selectedFont?.css || 'sans-serif'};
  font-size: ${fontSize[0]}px;
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  text-transform: ${textTransform};
  line-height: ${lineHeight[0]};
  letter-spacing: ${letterSpacing[0]}px;
}`;
  };

  const downloadCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'font-styles.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Load Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Fira+Code:wght@300;400;500;600;700&family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      
      <div className="min-h-screen pt-20 relative">
        <BackgroundShapes />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Font Changer
                </span>
              </h1>
              <p className="text-muted-foreground">Transform text with beautiful fonts and typography</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="pill-button">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Text Input */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Your Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here..."
                  className="min-h-32 bg-background border-border text-foreground resize-none"
                />
              </CardContent>
            </Card>
            
            {/* Font Controls */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Font Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Font Size: {fontSize[0]}px
                  </label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={8}
                    max={72}
                    step={1}
                    className="w-full"
                  />
                </div>
                
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
              </CardContent>
            </Card>
            
            {/* Advanced Controls */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Line Height: {lineHeight[0]}
                  </label>
                  <Slider
                    value={lineHeight}
                    onValueChange={setLineHeight}
                    min={0.8}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Letter Spacing: {letterSpacing[0]}px
                  </label>
                  <Slider
                    value={letterSpacing}
                    onValueChange={setLetterSpacing}
                    min={-2}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={() => copyToClipboard(generateCSS())}
                    className="w-full pill-button bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Copy CSS
                  </Button>
                  
                  <Button
                    onClick={downloadCSS}
                    variant="outline"
                    className="w-full pill-button"
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download CSS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview */}
          <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background border border-border rounded-xl p-8">
                <div style={getPreviewStyle()} className="text-foreground">
                  {text || "Enter some text to see the preview"}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* CSS Output */}
          <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Generated CSS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background border border-border rounded-xl p-4">
                <pre className="text-sm text-foreground font-mono overflow-x-auto">
                  {generateCSS()}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          {/* Font Showcase */}
          <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Font Showcase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FONT_FAMILIES.slice(0, 12).map((font) => (
                  <div
                    key={font.value}
                    className="p-4 bg-background border border-border rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setFontFamily(font.value)}
                  >
                    <h4 className="text-sm font-medium text-foreground mb-2">{font.label}</h4>
                    <p style={{ fontFamily: font.css }} className="text-foreground">
                      The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
