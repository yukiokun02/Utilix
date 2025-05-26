import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, CloudUploadIcon, DownloadIcon, XIcon } from "lucide-react";
import { Link } from "wouter";
import { resizeImage } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [resizeMethod, setResizeMethod] = useState<'pixels' | 'percent'>('pixels');
  const [widthPercent, setWidthPercent] = useState<number>(100);
  const [heightPercent, setHeightPercent] = useState<number>(100);
  const [targetFileSize, setTargetFileSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number; height: number} | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
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
    setOriginalFileSize(file.size);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResizedUrl("");

    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResizedUrl("");
    setOriginalDimensions(null);
    setOriginalFileSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const handleWidthChange = (newWidth: number) => {
    if (resizeMethod === 'pixels') {
      setWidth(newWidth);
      if (maintainRatio && originalDimensions) {
        const ratio = originalDimensions.height / originalDimensions.width;
        setHeight(Math.round(newWidth * ratio));
      }
    } else {
      setWidthPercent(newWidth);
      if (maintainRatio) {
        setHeightPercent(newWidth);
      }
      if (originalDimensions) {
        setWidth(Math.round(originalDimensions.width * (newWidth / 100)));
        setHeight(Math.round(originalDimensions.height * (newWidth / 100)));
      }
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (resizeMethod === 'pixels') {
      setHeight(newHeight);
      if (maintainRatio && originalDimensions) {
        const ratio = originalDimensions.width / originalDimensions.height;
        setWidth(Math.round(newHeight * ratio));
      }
    } else {
      setHeightPercent(newHeight);
      if (maintainRatio) {
        setWidthPercent(newHeight);
      }
      if (originalDimensions) {
        setWidth(Math.round(originalDimensions.width * (newHeight / 100)));
        setHeight(Math.round(originalDimensions.height * (newHeight / 100)));
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleResize = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to resize",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const resizedBlob = await resizeImage(selectedFile, width, height);
      const url = URL.createObjectURL(resizedBlob);
      setResizedUrl(url);
      toast({
        title: "Image resized successfully",
        description: `New dimensions: ${width}x${height}px`
      });
    } catch (error) {
      toast({
        title: "Error resizing image",
        description: "Failed to resize the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = `resized_${selectedFile?.name || 'image.png'}`;
    a.click();
  };

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Image Resizer
              </span>
            </h1>
            <p className="text-muted-foreground">Resize images while maintaining quality</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="pill-button">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Area */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground mb-2">Drag and drop your image here</p>
                  <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
                  <Button className="pill-button bg-gradient-to-r from-indigo-500 to-purple-600">
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <img src={previewUrl} alt="Selected" className="max-w-full h-auto max-h-48 mx-auto rounded-lg" />
                  </div>
                  <Button 
                    onClick={handleRemoveFile}
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div>Original: {originalDimensions?.width} × {originalDimensions?.height}px</div>
                    <div>Size: {formatFileSize(originalFileSize)}</div>
                    <div className="font-medium text-foreground">{selectedFile.name}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Resize Controls */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Resize Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground mb-2 block">Resize Method</Label>
                <Select value={resizeMethod} onValueChange={(value: 'pixels' | 'percent') => setResizeMethod(value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pixels">Pixels</SelectItem>
                    <SelectItem value="percent">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {resizeMethod === 'pixels' ? (
                <>
                  <div>
                    <Label className="text-foreground">Width (px)</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="bg-background border-border text-foreground"
                      placeholder="800"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Height (px)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="bg-background border-border text-foreground"
                      placeholder="600"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-foreground">Width (%)</Label>
                    <Input
                      type="number"
                      value={widthPercent}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="bg-background border-border text-foreground"
                      placeholder="100"
                      min="1"
                      max="500"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Height (%)</Label>
                    <Input
                      type="number"
                      value={heightPercent}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="bg-background border-border text-foreground"
                      placeholder="100"
                      min="1"
                      max="500"
                    />
                  </div>
                </>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maintainRatio"
                  checked={maintainRatio}
                  onCheckedChange={(checked) => setMaintainRatio(checked as boolean)}
                />
                <Label htmlFor="maintainRatio" className="text-foreground">Maintain aspect ratio</Label>
              </div>
              
              <div>
                <Label className="text-foreground">Target File Size (KB, optional)</Label>
                <Input
                  type="number"
                  value={targetFileSize}
                  onChange={(e) => setTargetFileSize(Number(e.target.value))}
                  className="bg-background border-border text-foreground"
                  placeholder="0 (no limit)"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty or 0 for no compression limit
                </p>
              </div>
              
              <Button 
                onClick={handleResize}
                disabled={!selectedFile || isProcessing}
                className="w-full pill-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {isProcessing ? "Resizing..." : "Resize Image"}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Area */}
        <Card className="solid-card">
          <CardHeader>
            <CardTitle className="text-foreground">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {previewUrl && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Original</h4>
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <img src={previewUrl} alt="Original" className="max-w-full h-auto" />
                  </div>
                </div>
              )}
              
              {resizedUrl && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">Resized ({width}×{height}px)</h4>
                    <Button onClick={handleDownload} size="sm" className="pill-button">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <img src={resizedUrl} alt="Resized" className="max-w-full h-auto" />
                  </div>
                </div>
              )}
              
              {!previewUrl && (
                <div className="col-span-full flex items-center justify-center h-64 border border-border rounded-xl bg-background">
                  <p className="text-muted-foreground">Upload an image to see preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
