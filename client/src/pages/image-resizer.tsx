import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, CloudUploadIcon, DownloadIcon, XIcon, CropIcon, RefreshCwIcon, RotateCcwIcon, ScissorsIcon } from "lucide-react";
import { Link } from "wouter";
import { resizeImage, convertImage } from "@/lib/image-utils";
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
  const [qualityPercent, setQualityPercent] = useState<number>(90);
  const [resizedFileSize, setResizedFileSize] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("resize");
  const [targetFileSize, setTargetFileSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number; height: number} | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Cropping state
  const [croppedUrl, setCroppedUrl] = useState<string>("");
  const [cropMode, setCropMode] = useState<'freeform' | 'aspect'>('freeform');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [cropData, setCropData] = useState<{x: number; y: number; width: number; height: number} | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStartX, setCropStartX] = useState<number>(0);
  const [cropStartY, setCropStartY] = useState<number>(0);
  const [cropEndX, setCropEndX] = useState<number>(0);
  const [cropEndY, setCropEndY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
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
    setResizedUrl("");
    setConvertedUrl("");
    setCroppedUrl("");
    setOriginalFileSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);
      
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        // Reset percentage values when new image is loaded
        setWidthPercent(100);
        setHeightPercent(100);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResizedUrl("");
    setCroppedUrl("");
    setConvertedUrl("");
    setOriginalDimensions(null);
    setOriginalFileSize(0);
    setIsCropping(false);
    setCropData(null);
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
    setWidth(newWidth);
    if (maintainRatio && originalDimensions) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainRatio && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResizeMethodChange = (method: 'pixels' | 'percent') => {
    setResizeMethod(method);
    // Don't show popup when switching between methods
    if (method === 'percent' && originalDimensions) {
      // Calculate current percentage based on current pixel values
      const currentWidthPercent = (width / originalDimensions.width) * 100;
      const currentHeightPercent = (height / originalDimensions.height) * 100;
      setWidthPercent(Math.round(currentWidthPercent));
      setHeightPercent(Math.round(currentHeightPercent));
    }
  };

  const handleResize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const resizedBlob = await resizeImage(selectedFile, width, height, qualityPercent / 100);
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

  // Cropping functions
  const handleCropStart = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isCropping) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropStartX(x);
    setCropStartY(y);
    setCropEndX(x);
    setCropEndY(y);
    setIsDragging(true);
  };

  const handleCropMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isCropping || !isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropEndX(x);
    setCropEndY(y);
  };

  const handleCropEnd = () => {
    if (!isCropping || !isDragging) return;
    
    setIsDragging(false);
    
    // Calculate crop area
    const x = Math.min(cropStartX, cropEndX);
    const y = Math.min(cropStartY, cropEndY);
    const width = Math.abs(cropEndX - cropStartX);
    const height = Math.abs(cropEndY - cropStartY);
    
    if (width > 10 && height > 10) {
      setCropData({ x, y, width, height });
    }
  };

  const applyCrop = async () => {
    if (!selectedFile || !cropData || !cropImageRef.current) return;

    setIsProcessing(true);
    try {
      const canvas = cropCanvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = cropImageRef.current;
      
      // Calculate scaling factors
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      
      // Set canvas size to crop dimensions
      canvas.width = cropData.width * scaleX;
      canvas.height = cropData.height * scaleY;
      
      // Draw cropped portion
      ctx.drawImage(
        img,
        cropData.x * scaleX,
        cropData.y * scaleY,
        cropData.width * scaleX,
        cropData.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCroppedUrl(url);
          setIsCropping(false);
          setCropData(null);
          
          toast({
            title: "Success!",
            description: "Image cropped successfully",
          });
        }
      }, 'image/png');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to crop image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCrop = () => {
    setIsCropping(false);
    setCropData(null);
    setCroppedUrl("");
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

  const handleDownload = () => {
    const url = resizedUrl || croppedUrl || convertedUrl;
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `processed-image.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const aspectRatios = [
    { value: 'freeform', label: 'Freeform' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '4:3', label: '4:3' },
    { value: '16:9', label: '16:9' },
    { value: '3:2', label: '3:2' },
    { value: '21:9', label: '21:9' },
  ];

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Image Resizer/Converter
              </span>
            </h1>
            <p className="text-gray-300 font-medium">Resize, convert, crop, and optimize images with professional tools</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        {/* Upload Area */}
        <Card className="solid-card mb-8">
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
                <p className="text-foreground font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-muted-foreground text-sm">Supports JPEG, PNG, WebP, GIF, BMP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="text-center">
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

        {selectedFile && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resize">Resize</TabsTrigger>
              <TabsTrigger value="crop">Crop</TabsTrigger>
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
            </TabsList>

            <TabsContent value="resize" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resize Controls */}
                <Card className="solid-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Resize Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2 block">Resize Method</Label>
                      <Select value={resizeMethod} onValueChange={handleResizeMethodChange}>
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
                      <div className="space-y-4">
                        <div>
                          <Label className="text-foreground mb-2 block">Size Percentage: {widthPercent}%</Label>
                          <Slider
                            value={[widthPercent]}
                            onValueChange={(value) => {
                              setWidthPercent(value[0]);
                              setHeightPercent(value[0]);
                              if (originalDimensions) {
                                setWidth(Math.round(originalDimensions.width * (value[0] / 100)));
                                setHeight(Math.round(originalDimensions.height * (value[0] / 100)));
                              }
                            }}
                            max={200}
                            min={10}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>10%</span>
                            <span>200%</span>
                          </div>
                        </div>
                      </div>
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
                      <Label className="text-foreground mb-2 block">Image Quality: {qualityPercent}%</Label>
                      <Slider
                        value={[qualityPercent]}
                        onValueChange={(value) => setQualityPercent(value[0])}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>10% (Smallest)</span>
                        <span>100% (Best Quality)</span>
                      </div>
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

                {/* Preview */}
                {resizedUrl && (
                  <Card className="solid-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Resized Preview</CardTitle>
                        <Button onClick={handleDownload} size="sm" className="pill-button">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background">
                        <img src={resizedUrl} alt="Resized" className="max-w-full h-auto" />
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>New Dimensions: {width} × {height}px</div>
                            <div>New File Size: <span className="font-semibold text-white">{formatFileSize(resizedFileSize)}</span></div>
                            <div>Quality: <span className="font-semibold text-emerald-400">{qualityPercent}%</span></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="crop" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Crop Controls */}
                <Card className="solid-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Crop Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2 block">Aspect Ratio</Label>
                      <Select value={cropMode === 'freeform' ? 'freeform' : aspectRatio} onValueChange={(value) => {
                        if (value === 'freeform') {
                          setCropMode('freeform');
                        } else {
                          setCropMode('aspect');
                          setAspectRatio(value);
                        }
                      }}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {aspectRatios.map((ratio) => (
                            <SelectItem key={ratio.value} value={ratio.value}>
                              {ratio.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        onClick={() => setIsCropping(!isCropping)}
                        variant={isCropping ? "destructive" : "default"}
                        className="w-full"
                      >
                        <ScissorsIcon className="w-4 h-4 mr-2" />
                        {isCropping ? "Cancel Crop" : "Start Cropping"}
                      </Button>
                      
                      {cropData && (
                        <Button 
                          onClick={applyCrop}
                          disabled={isProcessing}
                          className="w-full pill-button bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        >
                          {isProcessing ? "Cropping..." : "Apply Crop"}
                        </Button>
                      )}
                      
                      {(isCropping || cropData) && (
                        <Button 
                          onClick={resetCrop}
                          variant="outline"
                          className="w-full"
                        >
                          <RotateCcwIcon className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Crop Preview */}
                <Card className="solid-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      {isCropping ? "Select Area to Crop" : "Crop Preview"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-border rounded-xl p-4 bg-background relative">
                      {croppedUrl ? (
                        <div>
                          <img src={croppedUrl} alt="Cropped" className="max-w-full h-auto" />
                          <div className="mt-3 flex justify-center">
                            <Button onClick={handleDownload} size="sm" className="pill-button">
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Download Cropped
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            ref={cropImageRef}
                            src={previewUrl} 
                            alt="Original" 
                            className={`max-w-full h-auto ${isCropping ? 'cursor-crosshair' : ''}`}
                            onMouseDown={handleCropStart}
                            onMouseMove={handleCropMove}
                            onMouseUp={handleCropEnd}
                            draggable={false}
                          />
                          {isCropping && isDragging && (
                            <div 
                              className="absolute border-2 border-blue-500 bg-blue-500/20"
                              style={{
                                left: Math.min(cropStartX, cropEndX),
                                top: Math.min(cropStartY, cropEndY),
                                width: Math.abs(cropEndX - cropStartX),
                                height: Math.abs(cropEndY - cropStartY),
                              }}
                            />
                          )}
                          {cropData && !isDragging && (
                            <div 
                              className="absolute border-2 border-emerald-500 bg-emerald-500/20"
                              style={{
                                left: cropData.x,
                                top: cropData.y,
                                width: cropData.width,
                                height: cropData.height,
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <canvas ref={cropCanvasRef} className="hidden" />
            </TabsContent>

            <TabsContent value="convert" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Convert Controls */}
                <Card className="solid-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Convert Format</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2 block">Output Format</Label>
                      <Select value={outputFormat} onValueChange={setOutputFormat}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                          <SelectItem value="bmp">BMP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleConvert}
                      disabled={!selectedFile || isProcessing}
                      className="w-full pill-button bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      {isProcessing ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
                    </Button>
                  </CardContent>
                </Card>

                {/* Convert Preview */}
                {convertedUrl && (
                  <Card className="solid-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Converted Preview</CardTitle>
                        <Button onClick={handleDownload} size="sm" className="pill-button">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background">
                        <img src={convertedUrl} alt="Converted" className="max-w-full h-auto" />
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>Format: <span className="font-semibold text-white">{outputFormat.toUpperCase()}</span></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="optimize" className="mt-6">
              <Card className="solid-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Optimize Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-foreground mb-2 block">Target File Size (KB)</Label>
                    <Input
                      type="number"
                      value={targetFileSize}
                      onChange={(e) => setTargetFileSize(Number(e.target.value))}
                      className="bg-background border-border text-foreground"
                      placeholder="500"
                    />
                  </div>
                  
                  <Button 
                    disabled={!selectedFile || isProcessing}
                    className="w-full pill-button bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    {isProcessing ? "Optimizing..." : "Optimize Image"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}