import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, CloudUploadIcon, DownloadIcon, XIcon, CropIcon, RotateCcwIcon, SquareIcon, RectangleHorizontalIcon, RectangleVerticalIcon, MonitorIcon, SmartphoneIcon, CreditCardIcon, BookOpenIcon, ImageIcon } from "lucide-react";
import { Link } from "wouter";
import { resizeImage, convertImage } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

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
  
  // Cropping state
  const [croppedUrl, setCroppedUrl] = useState<string>("");
  const [cropAspectRatio, setCropAspectRatio] = useState<string>('freeform');
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{x: number; y: number} | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [imageScale, setImageScale] = useState(1);
  
  // Optimization state
  const [qualitySlider, setQualitySlider] = useState<number>(90);
  const [targetSizeSlider, setTargetSizeSlider] = useState<number>(50);
  const [optimizedUrl, setOptimizedUrl] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    setOptimizedUrl("");
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
        
        // Set optimization sliders based on file size
        const fileSizeKB = file.size / 1024;
        setTargetSizeSlider(Math.min(fileSizeKB * 0.7, 100)); // 70% of original size or max 100KB
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
    setOptimizedUrl("");
    setOriginalDimensions(null);
    setOriginalFileSize(0);
    setCropArea(null);
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

  // Advanced cropping functions
  const getAspectRatio = (ratio: string) => {
    switch (ratio) {
      case '1:1': return 1;
      case '16:9': return 16/9;
      case '4:3': return 4/3;
      case '3:2': return 3/2;
      case '9:16': return 9/16;
      case '21:9': return 21/9;
      case '2:3': return 2/3;
      case '5:4': return 5/4;
      case '16:10': return 16/10;
      case '3:4': return 3/4;
      case '8.5:11': return 8.5/11;
      default: return null;
    }
  };

  const updateCropAreaForAspectRatio = (ratio: string) => {
    if (!cropArea || !cropImageRef.current) return;
    
    const aspectRatio = getAspectRatio(ratio);
    if (!aspectRatio) return;
    
    const containerRect = cropImageRef.current.getBoundingClientRect();
    const centerX = cropArea.x + cropArea.width / 2;
    const centerY = cropArea.y + cropArea.height / 2;
    
    let newWidth = cropArea.width;
    let newHeight = newWidth / aspectRatio;
    
    if (newHeight > containerRect.height * 0.8) {
      newHeight = containerRect.height * 0.8;
      newWidth = newHeight * aspectRatio;
    }
    
    setCropArea({
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight
    });
  };

  const handleCropAspectRatioChange = (ratio: string) => {
    setCropAspectRatio(ratio);
    if (ratio !== 'freeform') {
      updateCropAreaForAspectRatio(ratio);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!cropArea) return;
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragStart || !cropArea || !cropImageRef.current) return;
    
    const containerRect = cropImageRef.current.getBoundingClientRect();
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    if (isDragging) {
      // Move crop area
      const newX = Math.max(0, Math.min(containerRect.width - cropArea.width, cropArea.x + deltaX));
      const newY = Math.max(0, Math.min(containerRect.height - cropArea.height, cropArea.y + deltaY));
      
      setCropArea({ ...cropArea, x: newX, y: newY });
      setDragStart({ x: clientX, y: clientY });
    } else if (isResizing) {
      // Resize crop area
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;
      let newX = cropArea.x;
      let newY = cropArea.y;
      
      const aspectRatio = getAspectRatio(cropAspectRatio);
      
      if (resizeHandle.includes('right')) {
        newWidth = Math.max(50, Math.min(containerRect.width - cropArea.x, cropArea.width + deltaX));
      }
      if (resizeHandle.includes('left')) {
        const widthChange = -deltaX;
        newWidth = Math.max(50, cropArea.width + widthChange);
        newX = cropArea.x - widthChange;
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = Math.max(50, Math.min(containerRect.height - cropArea.y, cropArea.height + deltaY));
      }
      if (resizeHandle.includes('top')) {
        const heightChange = -deltaY;
        newHeight = Math.max(50, cropArea.height + heightChange);
        newY = cropArea.y - heightChange;
      }
      
      // Maintain aspect ratio if set
      if (aspectRatio) {
        if (resizeHandle.includes('right') || resizeHandle.includes('left')) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }
      
      // Ensure crop area stays within bounds
      newX = Math.max(0, Math.min(containerRect.width - newWidth, newX));
      newY = Math.max(0, Math.min(containerRect.height - newHeight, newY));
      
      setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
      setDragStart({ x: clientX, y: clientY });
    }
  }, [isDragging, isResizing, dragStart, cropArea, resizeHandle, cropAspectRatio]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
    setResizeHandle('');
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleMouseMove, options);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, options);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleTouchMove, handleMouseUp]);

  const applyCrop = async () => {
    if (!selectedFile || !cropArea || !cropImageRef.current) return;

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = cropImageRef.current;
      
      // Calculate scaling factors
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;
      
      // Set canvas size to crop dimensions
      canvas.width = cropArea.width * scaleX;
      canvas.height = cropArea.height * scaleY;
      
      // Draw cropped portion
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
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
        description: `Image optimized to ${formatFileSize(optimizedBlob.size)}`,
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

  const handleDownload = (url?: string) => {
    const downloadUrl = url || resizedUrl || croppedUrl || convertedUrl || optimizedUrl;
    if (!downloadUrl) return;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
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
    { value: 'freeform', label: 'Freeform', icon: CropIcon, desc: 'Any size' },
    { value: '1:1', label: 'Square', icon: SquareIcon, desc: 'Instagram post' },
    { value: '16:9', label: 'Widescreen', icon: MonitorIcon, desc: 'YouTube thumbnail' },
    { value: '4:3', label: 'Standard', icon: RectangleHorizontalIcon, desc: 'Classic photo' },
    { value: '3:2', label: 'Photo', icon: ImageIcon, desc: 'DSLR format' },
    { value: '9:16', label: 'Story', icon: SmartphoneIcon, desc: 'Instagram story' },
    { value: '21:9', label: 'Ultrawide', icon: RectangleHorizontalIcon, desc: 'Cinema banner' },
    { value: '2:3', label: 'Portrait', icon: RectangleVerticalIcon, desc: 'Book cover' },
    { value: '5:4', label: 'Print', icon: BookOpenIcon, desc: 'Photo print' },
    { value: '16:10', label: 'Display', icon: MonitorIcon, desc: 'Laptop screen' },
    { value: '3:4', label: 'Mobile', icon: SmartphoneIcon, desc: 'Phone wallpaper' },
    { value: '8.5:11', label: 'Letter', icon: BookOpenIcon, desc: 'Document page' },
  ];

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Image Tool
              </span>
            </h1>
            <p className="text-gray-300 font-medium text-sm sm:text-base">Resize, convert, crop, and optimize images with professional tools</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-center">
            <Link href="/">
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
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
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="maintainRatio"
                        checked={maintainRatio}
                        onCheckedChange={(checked) => setMaintainRatio(checked as boolean)}
                      />
                      <Label htmlFor="maintainRatio" className="text-foreground">Maintain aspect ratio</Label>
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
                        <Button onClick={() => handleDownload(resizedUrl)} size="sm" className="pill-button bg-white text-black hover:bg-gray-200">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          <span className="text-black font-medium">Download</span>
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
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="crop" className="mt-6">
              <div className="space-y-6">
                {/* Aspect Ratio Selection */}
                <Card className="solid-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Select Aspect Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {aspectRatios.map((ratio) => (
                        <div
                          key={ratio.value}
                          onClick={() => handleCropAspectRatioChange(ratio.value)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            cropAspectRatio === ratio.value 
                              ? 'border-blue-500 bg-blue-500/10 shadow-lg' 
                              : 'border-border hover:border-blue-300 bg-background'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <ratio.icon className={`w-6 h-6 ${cropAspectRatio === ratio.value ? 'text-blue-500' : 'text-muted-foreground'}`} />
                            <div className="text-center">
                              <div className={`text-sm font-medium ${cropAspectRatio === ratio.value ? 'text-blue-500' : 'text-foreground'}`}>
                                {ratio.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {ratio.desc}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Crop Area */}
                <Card className="solid-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      {croppedUrl ? "Cropped Result" : "Drag to Crop"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {croppedUrl ? (
                      <div className="space-y-4">
                        <div className="border border-border rounded-xl p-4 bg-background">
                          <img src={croppedUrl} alt="Cropped" className="max-w-full h-auto mx-auto" />
                        </div>
                        <div className="flex justify-center space-x-3">
                          <Button onClick={() => handleDownload(croppedUrl)} className="pill-button bg-white text-black hover:bg-gray-200">
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            <span className="text-black font-medium">Download</span>
                          </Button>
                          <Button onClick={() => setCroppedUrl("")} variant="outline">
                            Crop Again
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div 
                          ref={cropContainerRef} 
                          className="relative border border-border rounded-xl p-4 bg-background overflow-hidden"
                          style={{ touchAction: 'none' }}
                        >
                          <img 
                            ref={cropImageRef}
                            src={previewUrl} 
                            alt="Original" 
                            className="max-w-full h-auto select-none pointer-events-none"
                            draggable={false}
                            onLoad={() => {
                              // Initialize crop area after image loads
                              setTimeout(() => {
                                if (cropImageRef.current && !cropArea) {
                                  const img = cropImageRef.current;
                                  const rect = img.getBoundingClientRect();
                                  const size = Math.min(rect.width, rect.height) * 0.6;
                                  setCropArea({
                                    x: (rect.width - size) / 2,
                                    y: (rect.height - size) / 2,
                                    width: size,
                                    height: size
                                  });
                                }
                              }, 100);
                            }}
                          />
                          {cropArea && cropImageRef.current && (
                            <div 
                              className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move select-none"
                              style={{
                                left: cropArea.x,
                                top: cropArea.y,
                                width: cropArea.width,
                                height: cropArea.height,
                                touchAction: 'none'
                              }}
                              onMouseDown={(e) => handleMouseDown(e)}
                              onTouchStart={(e) => {
                                e.preventDefault();
                                const touch = e.touches[0];
                                if (touch) {
                                  handleMouseDown({
                                    preventDefault: () => {},
                                    stopPropagation: () => {},
                                    clientX: touch.clientX,
                                    clientY: touch.clientY
                                  } as any);
                                }
                              }}
                            >
                              {/* Corner handles - larger for mobile */}
                              <div 
                                className="absolute w-4 h-4 sm:w-3 sm:h-3 bg-blue-500 border border-white -top-2 -left-2 cursor-nw-resize touch-manipulation"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  handleMouseDown(e, 'top-left');
                                }}
                                onTouchStart={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const touch = e.touches[0];
                                  if (touch) {
                                    setIsResizing(true);
                                    setResizeHandle('top-left');
                                    setDragStart({ x: touch.clientX, y: touch.clientY });
                                  }
                                }}
                              />
                              <div 
                                className="absolute w-4 h-4 sm:w-3 sm:h-3 bg-blue-500 border border-white -top-2 -right-2 cursor-ne-resize touch-manipulation"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  handleMouseDown(e, 'top-right');
                                }}
                                onTouchStart={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const touch = e.touches[0];
                                  if (touch) {
                                    setIsResizing(true);
                                    setResizeHandle('top-right');
                                    setDragStart({ x: touch.clientX, y: touch.clientY });
                                  }
                                }}
                              />
                              <div 
                                className="absolute w-4 h-4 sm:w-3 sm:h-3 bg-blue-500 border border-white -bottom-2 -left-2 cursor-sw-resize touch-manipulation"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  handleMouseDown(e, 'bottom-left');
                                }}
                                onTouchStart={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const touch = e.touches[0];
                                  if (touch) {
                                    setIsResizing(true);
                                    setResizeHandle('bottom-left');
                                    setDragStart({ x: touch.clientX, y: touch.clientY });
                                  }
                                }}
                              />
                              <div 
                                className="absolute w-4 h-4 sm:w-3 sm:h-3 bg-blue-500 border border-white -bottom-2 -right-2 cursor-se-resize touch-manipulation"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  handleMouseDown(e, 'bottom-right');
                                }}
                                onTouchStart={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const touch = e.touches[0];
                                  if (touch) {
                                    setIsResizing(true);
                                    setResizeHandle('bottom-right');
                                    setDragStart({ x: touch.clientX, y: touch.clientY });
                                  }
                                }}
                              />
                              
                              {/* Grid lines for better visibility */}
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-blue-400/50"></div>
                                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-blue-400/50"></div>
                                <div className="absolute top-1/3 left-0 right-0 h-px bg-blue-400/50"></div>
                                <div className="absolute top-2/3 left-0 right-0 h-px bg-blue-400/50"></div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-center">
                          <Button 
                            onClick={applyCrop}
                            disabled={isProcessing || !cropArea}
                            className="pill-button bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                          >
                            {isProcessing ? "Cropping..." : "Apply Crop"}
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground text-center">
                          Drag the blue area to move • Drag corners to resize
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <canvas ref={canvasRef} className="hidden" />
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
                        <Button onClick={() => handleDownload(convertedUrl)} size="sm" className="pill-button bg-white text-black hover:bg-gray-200">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          <span className="text-black font-medium">Download</span>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Optimize Controls */}
                <Card className="solid-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Optimize Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-foreground mb-2 block">Image Quality: {qualitySlider}%</Label>
                      <Slider
                        value={[qualitySlider]}
                        onValueChange={(value) => setQualitySlider(value[0])}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>10% (Lowest)</span>
                        <span>100% (Highest)</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-foreground mb-2 block">Target File Size: {targetSizeSlider}KB</Label>
                      <Slider
                        value={[targetSizeSlider]}
                        onValueChange={(value) => setTargetSizeSlider(value[0])}
                        max={Math.round((originalFileSize / 1024) || 100)}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>10KB</span>
                        <span>{Math.round((originalFileSize / 1024) || 100)}KB (Original)</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleOptimize}
                      disabled={!selectedFile || isProcessing}
                      className="w-full pill-button bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      {isProcessing ? "Optimizing..." : "Optimize Image"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Optimize Preview */}
                {optimizedUrl && (
                  <Card className="solid-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Optimized Preview</CardTitle>
                        <Button onClick={() => handleDownload(optimizedUrl)} size="sm" className="pill-button bg-white text-black hover:bg-gray-200">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          <span className="text-black font-medium">Download</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-border rounded-xl p-4 bg-background">
                        <img src={optimizedUrl} alt="Optimized" className="max-w-full h-auto" />
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>Quality: <span className="font-semibold text-white">{qualitySlider}%</span></div>
                            <div>Target Size: <span className="font-semibold text-white">{targetSizeSlider}KB</span></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}