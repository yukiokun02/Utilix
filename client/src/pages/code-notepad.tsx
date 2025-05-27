import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackgroundShapes from "@/components/background-shapes";
import DownloadPopup from "@/components/download-popup";
import { ArrowLeftIcon, SaveIcon, DownloadIcon, CopyIcon, FileTextIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CodeNotepad() {
  const [code, setCode] = useState('Input your text here');
  const [fileName, setFileName] = useState('untitled');
  const [extension, setExtension] = useState('txt');
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{url: string, filename: string} | null>(null);
  const { toast } = useToast();

  const fullFileName = `${fileName}.${extension}`;

  const handleNewFile = () => {
    setCode('Input your text here');
    setFileName('untitled');
    setExtension('txt');
    toast({
      title: "New File Created",
      description: "Ready to start writing!",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setPendingDownload({ url, filename: fullFileName });
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
        description: `File saved as ${pendingDownload.filename}`,
      });
    }
  };

  const handleClear = () => {
    setCode('Input your text here');
    toast({
      title: "Cleared",
      description: "Text area cleared",
    });
  };

  const getLineNumbers = () => {
    const lines = code.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
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
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Text Editor
              </span>
            </h1>
            <p className="text-gray-300 font-medium text-sm sm:text-base">Write, edit, and save text with powerful editing tools</p>
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
              Type your text, set filename & extension, use toolbar buttons to copy/download your content.
            </p>
          </CardContent>
        </Card>

        {/* Editor Controls */}
        <Card className="solid-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Editor Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-foreground">Filename</Label>
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-background border-border text-foreground"
                  placeholder="Enter filename"
                />
              </div>
              <div>
                <Label className="text-foreground">Extension</Label>
                <Input
                  value={extension}
                  onChange={(e) => setExtension(e.target.value)}
                  className="bg-background border-border text-foreground"
                  placeholder="txt, js, py, etc."
                />
              </div>
              <div className="flex items-end">
                <div className="w-full p-3 bg-gray-800/50 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground">Output:</div>
                  <div className="font-semibold text-foreground">{fullFileName}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleNewFile} size="sm" variant="outline" className="gap-2">
                <PlusIcon className="w-4 h-4" />
              </Button>
              <Button onClick={handleCopy} size="sm" variant="outline" className="gap-2">
                <CopyIcon className="w-4 h-4" />
              </Button>
              <Button onClick={handleDownload} size="sm" className="pill-button bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                <DownloadIcon className="w-4 h-4" />
              </Button>
              <Button onClick={handleClear} size="sm" variant="destructive">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Text Editor */}
        <Card className="solid-card">
          <CardHeader>
            <CardTitle className="text-foreground">Text Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex border border-border rounded-lg overflow-hidden bg-gray-900">
              {/* Line Numbers */}
              <div className="bg-gray-800 p-4 select-none border-r border-border">
                <div className="text-xs text-gray-500 font-mono leading-6">
                  {getLineNumbers().map(num => (
                    <div key={num} className="text-right">{num}</div>
                  ))}
                </div>
              </div>
              
              {/* Code Area */}
              <div className="flex-1">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[400px] resize-none border-0 rounded-none bg-gray-900 text-green-400 font-mono text-sm leading-6 focus:ring-0 focus:border-0"
                  placeholder="Input your text here"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Middle Ad Between Options and Workplace */}
        <div className="my-8">
          <div className="bg-gray-800/30 rounded-lg p-4 text-center text-gray-400 border border-gray-600/30">
            <div className="h-24 flex items-center justify-center text-sm">
              Middle Ad Area (728x90)
            </div>
          </div>
        </div>

        {/* Information Section */}
        <Card className="solid-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">About Text Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our Text Editor is a simple yet powerful tool for writing and editing text content. Whether you're writing code, 
                taking notes, or creating documents, this editor provides a clean interface with essential features.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Features:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Line numbering for easy navigation</li>
                    <li>• Customizable file names and extensions</li>
                    <li>• One-click copy to clipboard</li>
                    <li>• Download files in any format</li>
                    <li>• Clean, distraction-free interface</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Perfect For:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Writing code snippets</li>
                    <li>• Creating configuration files</li>
                    <li>• Taking notes and documentation</li>
                    <li>• Editing text files</li>
                    <li>• Quick text formatting</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm">
                <strong>Tip:</strong> Use common file extensions like .txt for text, .js for JavaScript, .py for Python, 
                .html for HTML, .css for CSS, .md for Markdown, and more to organize your files properly.
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
        filename={pendingDownload?.filename || "untitled.txt"}
      />
    </div>
  );
}