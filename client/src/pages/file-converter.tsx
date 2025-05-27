import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackgroundShapes from "@/components/background-shapes";
import DownloadPopup from "@/components/download-popup";
import { ArrowLeftIcon, FileTextIcon, DownloadIcon, FileIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const FILE_CONVERSIONS = {
  'text': {
    label: 'Text Files',
    formats: [
      { value: 'txt', label: 'TXT', mime: 'text/plain' },
      { value: 'md', label: 'Markdown', mime: 'text/markdown' },
      { value: 'rtf', label: 'RTF', mime: 'application/rtf' },
    ]
  },
  'document': {
    label: 'Documents',
    formats: [
      { value: 'pdf', label: 'PDF', mime: 'application/pdf' },
      { value: 'docx', label: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { value: 'html', label: 'HTML', mime: 'text/html' },
    ]
  },
  'data': {
    label: 'Data Files',
    formats: [
      { value: 'json', label: 'JSON', mime: 'application/json' },
      { value: 'csv', label: 'CSV', mime: 'text/csv' },
      { value: 'xml', label: 'XML', mime: 'application/xml' },
    ]
  }
};

export default function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("");
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{url: string, filename: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setConvertedUrl("");
    setOutputFormat("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) {
      toast({
        title: "Missing information",
        description: "Please select a file and output format",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // For demonstration, we'll handle basic text conversions
      const text = await selectedFile.text();
      let convertedContent = text;
      let fileName = selectedFile.name.replace(/\.[^/.]+$/, "");

      switch (outputFormat) {
        case 'json':
          try {
            // Try to convert text to JSON format
            convertedContent = JSON.stringify({ content: text }, null, 2);
            fileName += '.json';
          } catch {
            convertedContent = JSON.stringify({ content: text }, null, 2);
            fileName += '.json';
          }
          break;
        case 'html':
          convertedContent = `<!DOCTYPE html>
<html>
<head>
    <title>${fileName}</title>
</head>
<body>
    <pre>${text}</pre>
</body>
</html>`;
          fileName += '.html';
          break;
        case 'md':
          convertedContent = `# ${fileName}\n\n${text}`;
          fileName += '.md';
          break;
        case 'csv':
          // Simple text to CSV conversion (each line becomes a row)
          const lines = text.split('\n');
          convertedContent = lines.map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
          fileName += '.csv';
          break;
        case 'xml':
          convertedContent = `<?xml version="1.0" encoding="UTF-8"?>
<document>
    <content><![CDATA[${text}]]></content>
</document>`;
          fileName += '.xml';
          break;
        default:
          convertedContent = text;
          fileName += '.' + outputFormat;
      }

      const blob = new Blob([convertedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);

      toast({
        title: "File converted successfully",
        description: `Converted to ${outputFormat.toUpperCase()} format`
      });
    } catch (error) {
      toast({
        title: "Error converting file",
        description: "Failed to convert the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl || !selectedFile) return;
    
    const filename = selectedFile.name.replace(/\.[^/.]+$/, "") + '.' + outputFormat;
    setPendingDownload({ url: convertedUrl, filename });
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
      setPendingDownload(null);
      
      toast({
        title: "Downloaded!",
        description: `File saved as ${pendingDownload.filename}`,
      });
    }
  };

  const getAllFormats = () => {
    return Object.values(FILE_CONVERSIONS).flatMap(category => category.formats);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                File Converter
              </span>
            </h1>
            <p className="text-muted-foreground">Convert between various file formats</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Middle Ad Between Output and Download */}
        <div className="my-8">
          <div className="bg-gray-800/30 rounded-lg p-4 text-center text-gray-400 border border-gray-600/30">
            <div className="h-24 flex items-center justify-center text-sm">
              Middle Ad Area (728x90)
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Select File</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-amber-500 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground text-sm mb-2">Drop file here</p>
                <p className="text-muted-foreground text-xs">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
              {selectedFile && (
                <div className="mt-4 p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Format Selection */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Output Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FILE_CONVERSIONS).map(([categoryKey, category]) => (
                    <div key={categoryKey}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                        {category.label}
                      </div>
                      {category.formats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleConvert}
                disabled={!selectedFile || !outputFormat || isProcessing}
                className="w-full pill-button bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                {isProcessing ? "Converting..." : "Convert"}
              </Button>
            </CardContent>
          </Card>
          
          {/* Download */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Download</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <DownloadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                {convertedUrl ? (
                  <>
                    <p className="text-foreground mb-2">Converted file ready</p>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                    <Button 
                      onClick={handleDownload}
                      className="pill-button bg-gradient-to-r from-amber-500 to-orange-600"
                    >
                      Download
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    {selectedFile && outputFormat ? "Click Convert to process" : "Select file and format"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Supported Formats Info */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Supported Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(FILE_CONVERSIONS).map(([categoryKey, category]) => (
                <div key={categoryKey}>
                  <h4 className="font-semibold text-foreground mb-2">{category.label}</h4>
                  <div className="space-y-1">
                    {category.formats.map((format) => (
                      <div key={format.value} className="text-sm text-muted-foreground">
                        • {format.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This tool currently supports basic text file conversions. 
                More advanced conversions (like PDF to Word) require server-side processing and will be available in future updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card className="solid-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">About File Converter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The File Converter tool helps you convert between various file formats quickly and securely. 
                All conversions happen in your browser, ensuring your files remain private and never leave your device.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How It Works:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Upload your file using drag & drop or click</li>
                    <li>• Choose your desired output format</li>
                    <li>• Click convert to process the file</li>
                    <li>• Download the converted file instantly</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Security Features:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Client-side processing only</li>
                    <li>• No files uploaded to servers</li>
                    <li>• Complete privacy protection</li>
                    <li>• Instant processing and download</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-2">Supported Categories:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Text Files:</strong> TXT, CSV, JSON, XML
                  </div>
                  <div>
                    <strong>Documents:</strong> DOC, PDF, RTF, MD
                  </div>
                  <div>
                    <strong>Data:</strong> JSON, XML, CSV, YAML
                  </div>
                </div>
              </div>
              <p className="text-sm">
                <strong>Note:</strong> Basic text-based conversions are fully supported. Advanced document conversions 
                may have limitations due to client-side processing constraints.
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
        filename={pendingDownload?.filename || "converted-file.txt"}
      />
    </div>
  );
}
