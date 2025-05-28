import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackgroundShapes from "@/components/background-shapes";
import DownloadPopup from "@/components/download-popup";
import { ArrowLeftIcon, CloudUploadIcon, DownloadIcon, XIcon, RotateCcwIcon, SquareIcon, RectangleHorizontalIcon, RectangleVerticalIcon, MonitorIcon, SmartphoneIcon, CreditCardIcon, BookOpenIcon, ImageIcon, Palette } from "lucide-react";
import { Link } from "wouter";
import { resizeImage, convertImage } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";

export default function ImageTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [resizedFileSize, setResizedFileSize] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("resize");
  const [originalDimensions, setOriginalDimensions] = useState<{width: number; height: number} | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Download popup state
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{url: string, filename: string} | null>(null);
  
  // Optimization state
  const [qualitySlider, setQualitySlider] = useState<number>(90);
  const [targetSizeSlider, setTargetSizeSlider] = useState<number>(50);
  const [optimizedUrl, setOptimizedUrl] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOriginalFileSize(file.size);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
    
    // Reset all outputs
    setResizedUrl("");
    setConvertedUrl("");
    setOptimizedUrl("");
  };

  const handleResize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const resizedBlob = await resizeImage(selectedFile, width, height, 0.9);
      const url = URL.createObjectURL(resizedBlob);
      setResizedUrl(url);
      setResizedFileSize(resizedBlob.size);
      
      toast({
        title: "Success!",
        description: "Image resized successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resize image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const convertedBlob = await convertImage(selectedFile, `image/${outputFormat}`);
      const url = URL.createObjectURL(convertedBlob);
      setConvertedUrl(url);
      
      toast({
        title: "Success!",
        description: `Image converted to ${outputFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      // Calculate target quality based on sliders
      const quality = qualitySlider / 100;
      const targetSizeKB = targetSizeSlider;
      
      let optimizedBlob = await resizeImage(selectedFile, 
        originalDimensions?.width || width, 
        originalDimensions?.height || height, 
        quality
      );
      
      // If still too large, reduce dimensions
      let currentWidth = originalDimensions?.width || width;
      let currentHeight = originalDimensions?.height || height;
      
      while (optimizedBlob.size > targetSizeKB * 1024 && currentWidth > 100) {
        currentWidth *= 0.9;
        currentHeight *= 0.9;
        optimizedBlob = await resizeImage(selectedFile, 
          Math.round(currentWidth), 
          Math.round(currentHeight), 
          quality
        );
      }
      
      const url = URL.createObjectURL(optimizedBlob);
      setOptimizedUrl(url);
      
      toast({
        title: "Success!",
        description: "Image optimized successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (url: string, format: string = 'png') => {
    if (!url) return;
    
    const filename = `image-${Date.now()}.${format}`;
    setPendingDownload({ url, filename });
    setShowDownloadPopup(true);
  };

  const executeDownload = () => {
    if (!pendingDownload) return;
    
    const link = document.createElement('a');
    link.href = pendingDownload.url;
    link.download = pendingDownload.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadPopup(false);
    setPendingDownload(null);
  };

  const updateDimensions = (newWidth: number, newHeight: number) => {
    if (maintainRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      if (newWidth !== width) {
        setHeight(Math.round(newWidth / aspectRatio));
      } else if (newHeight !== height) {
        setWidth(Math.round(newHeight * aspectRatio));
      }
    }
    setWidth(newWidth);
    setHeight(newHeight);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <BackgroundShapes variant="tools" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Image Resizer</h1>
              <p className="text-purple-200">Resize, convert and optimize your images</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-xl">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Top Ad Space */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl h-20 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Advertisement Space</span>
          </div>
        </div>

        {!selectedFile ? (
          <Card className="solid-card max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground mb-2">Upload Image</CardTitle>
              <p className="text-muted-foreground">Choose an image to resize, convert or optimize</p>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground mb-2">Click to upload or drag and drop</p>
                <p className="text-muted-foreground text-sm">Supports: JPG, PNG, GIF, WebP</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 bg-card">
                <TabsTrigger value="resize" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Resize
                </TabsTrigger>
                <TabsTrigger value="convert" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Convert
                </TabsTrigger>
                <TabsTrigger value="optimize" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Optimize
                </TabsTrigger>
              </TabsList>

              {/* Resize Tab */}
              <TabsContent value="resize" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Original Image</CardTitle>
                      {originalDimensions && (
                        <p className="text-muted-foreground">
                          {originalDimensions.width} × {originalDimensions.height} • {formatFileSize(originalFileSize)}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background">
                        <img src={previewUrl} alt="Original" className="max-w-full h-auto mx-auto" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Resize Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="width" className="text-foreground">Width (px)</Label>
                          <Input
                            id="width"
                            type="number"
                            value={width}
                            onChange={(e) => updateDimensions(parseInt(e.target.value) || 0, height)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height" className="text-foreground">Height (px)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => updateDimensions(width, parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="maintain-ratio"
                          checked={maintainRatio}
                          onCheckedChange={(checked) => setMaintainRatio(checked === true)}
                        />
                        <Label htmlFor="maintain-ratio" className="text-foreground">Maintain aspect ratio</Label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => updateDimensions(1920, maintainRatio ? Math.round(1920 / (originalDimensions?.width || 1) * (originalDimensions?.height || 1)) : 1080)} variant="outline" size="sm">
                          1920×1080
                        </Button>
                        <Button onClick={() => updateDimensions(1280, maintainRatio ? Math.round(1280 / (originalDimensions?.width || 1) * (originalDimensions?.height || 1)) : 720)} variant="outline" size="sm">
                          1280×720
                        </Button>
                        <Button onClick={() => updateDimensions(800, maintainRatio ? Math.round(800 / (originalDimensions?.width || 1) * (originalDimensions?.height || 1)) : 600)} variant="outline" size="sm">
                          800×600
                        </Button>
                        <Button onClick={() => updateDimensions(400, maintainRatio ? Math.round(400 / (originalDimensions?.width || 1) * (originalDimensions?.height || 1)) : 300)} variant="outline" size="sm">
                          400×300
                        </Button>
                      </div>

                      <Button onClick={handleResize} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700">
                        {isProcessing ? "Resizing..." : "Resize Image"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Middle Ad Space */}
                <div className="flex justify-center my-8">
                  <div className="w-full max-w-4xl h-20 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Advertisement Space</span>
                  </div>
                </div>

                {resizedUrl && (
                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Resized Result</CardTitle>
                      <p className="text-muted-foreground">
                        {width} × {height} • {formatFileSize(resizedFileSize)}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background mb-4">
                        <img src={resizedUrl} alt="Resized" className="max-w-full h-auto mx-auto" />
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={() => handleDownload(resizedUrl)} className="pill-button bg-white text-black hover:bg-gray-200">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          <span className="text-black font-medium">Download</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Convert Tab */}
              <TabsContent value="convert" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Original Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background">
                        <img src={previewUrl} alt="Original" className="max-w-full h-auto mx-auto" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Convert Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="output-format" className="text-foreground">Output Format</Label>
                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="webp">WebP</SelectItem>
                            <SelectItem value="gif">GIF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleConvert} disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700">
                        {isProcessing ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {convertedUrl && (
                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Converted Result</CardTitle>
                      <p className="text-muted-foreground">Format: {outputFormat.toUpperCase()}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background mb-4">
                        <img src={convertedUrl} alt="Converted" className="max-w-full h-auto mx-auto" />
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={() => handleDownload(convertedUrl, outputFormat)} className="pill-button bg-white text-black hover:bg-gray-200">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          <span className="text-black font-medium">Download</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Optimize Tab */}
              <TabsContent value="optimize" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Original Image</CardTitle>
                      <p className="text-muted-foreground">{formatFileSize(originalFileSize)}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background">
                        <img src={previewUrl} alt="Original" className="max-w-full h-auto mx-auto" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Optimization Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-foreground">Quality: {qualitySlider}%</Label>
                        <Slider
                          value={[qualitySlider]}
                          onValueChange={(value) => setQualitySlider(value[0])}
                          max={100}
                          min={10}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-foreground">Target Size: {targetSizeSlider} KB</Label>
                        <Slider
                          value={[targetSizeSlider]}
                          onValueChange={(value) => setTargetSizeSlider(value[0])}
                          max={500}
                          min={10}
                          step={5}
                          className="mt-2"
                        />
                      </div>

                      <Button onClick={handleOptimize} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700">
                        {isProcessing ? "Optimizing..." : "Optimize Image"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {optimizedUrl && (
                  <Card className="solid-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Optimized Result</CardTitle>
                      <p className="text-muted-foreground">Quality: {qualitySlider}% • Target: {targetSizeSlider} KB</p>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background mb-4">
                        <img src={optimizedUrl} alt="Optimized" className="max-w-full h-auto mx-auto" />
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={() => handleDownload(optimizedUrl)} className="pill-button bg-white text-black hover:bg-gray-200">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          <span className="text-black font-medium">Download</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Bottom Ad Space */}
            <div className="flex justify-center mt-8">
              <div className="w-full max-w-4xl h-20 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Advertisement Space</span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={() => {
                setSelectedFile(null);
                setPreviewUrl("");
                setResizedUrl("");
                setConvertedUrl("");
                setOptimizedUrl("");
              }} variant="outline">
                <XIcon className="w-4 h-4 mr-2" />
                Choose Different Image
              </Button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <DownloadPopup
        isOpen={showDownloadPopup}
        onClose={() => setShowDownloadPopup(false)}
        onDownload={executeDownload}
        filename={pendingDownload?.filename || ""}
      />
    </div>
  );
}