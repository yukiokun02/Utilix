import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, ImageIcon, DownloadIcon } from "lucide-react";
import { Link } from "wouter";
import { convertImage } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";

const SUPPORTED_FORMATS = [
  { value: 'jpeg', label: 'JPEG/JPG', mime: 'image/jpeg' },
  { value: 'png', label: 'PNG', mime: 'image/png' },
  { value: 'webp', label: 'WEBP', mime: 'image/webp' },
  { value: 'gif', label: 'GIF', mime: 'image/gif' },
  { value: 'bmp', label: 'BMP', mime: 'image/bmp' },
  { value: 'ico', label: 'ICO', mime: 'image/x-icon' },
  { value: 'tiff', label: 'TIFF', mime: 'image/tiff' },
  { value: 'svg', label: 'SVG', mime: 'image/svg+xml' },
];

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('jpeg');
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setConvertedUrl("");
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
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to convert",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const format = SUPPORTED_FORMATS.find(f => f.value === selectedFormat);
      if (!format) throw new Error("Invalid format");

      const convertedBlob = await convertImage(selectedFile, format.mime);
      const url = URL.createObjectURL(convertedBlob);
      setConvertedUrl(url);
      
      toast({
        title: "Image converted successfully",
        description: `Converted to ${format.label} format`
      });
    } catch (error) {
      toast({
        title: "Error converting image",
        description: "Failed to convert the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl || !selectedFile) return;
    
    const format = SUPPORTED_FORMATS.find(f => f.value === selectedFormat);
    const fileName = selectedFile.name.replace(/\.[^/.]+$/, "") + '.' + selectedFormat;
    
    const a = document.createElement('a');
    a.href = convertedUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Image Converter
              </span>
            </h1>
            <p className="text-muted-foreground">Convert between any image format</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="pill-button">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>
        
        {/* Supported Formats Info */}
        <Card className="solid-card mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Supported Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUPPORTED_FORMATS.map((format) => (
                <div key={format.value} className="text-center p-3 bg-background rounded-lg border border-border">
                  <div className="font-medium text-foreground">{format.label}</div>
                  <div className="text-xs text-muted-foreground">{format.mime.split('/')[1].toUpperCase()}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Convert between any of these popular image formats with high quality preservation.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Select Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground text-sm mb-2">Drop image here</p>
                <p className="text-muted-foreground text-xs">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
              {selectedFile && (
                <div className="mt-4 p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Format Selection */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Output Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {SUPPORTED_FORMATS.map((format) => (
                  <Button
                    key={format.value}
                    variant={selectedFormat === format.value ? "default" : "secondary"}
                    className={`pill-button ${
                      selectedFormat === format.value 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    {format.label}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={handleConvert}
                disabled={!selectedFile || isProcessing}
                className="w-full pill-button bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                {isProcessing ? "Converting..." : "Convert"}
              </Button>
            </CardContent>
          </Card>
          
          {/* Download */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Download</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <DownloadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                {convertedUrl ? (
                  <>
                    <p className="text-foreground mb-4">Converted file ready</p>
                    <Button 
                      onClick={handleDownload}
                      className="pill-button bg-gradient-to-r from-emerald-500 to-teal-600"
                    >
                      Download
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    {selectedFile ? "Click Convert to process" : "Upload an image to start"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview */}
        {selectedFile && (
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Original</h4>
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Original" 
                      className="max-w-full h-auto max-h-64 mx-auto"
                    />
                  </div>
                </div>
                
                {convertedUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Converted ({SUPPORTED_FORMATS.find(f => f.value === selectedFormat)?.label})
                    </h4>
                    <div className="border border-border rounded-xl p-4 bg-background">
                      <img 
                        src={convertedUrl} 
                        alt="Converted" 
                        className="max-w-full h-auto max-h-64 mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
