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
import DownloadPopup from "@/components/download-popup";
import { ArrowLeftIcon, CloudUploadIcon, DownloadIcon, XIcon, CropIcon, RotateCcwIcon, SquareIcon, RectangleHorizontalIcon, RectangleVerticalIcon, MonitorIcon, SmartphoneIcon, CreditCardIcon, BookOpenIcon, ImageIcon, Palette } from "lucide-react";
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [lastTouchDistance, setLastTouchDistance] = useState<number>(0);
  const [initialZoom, setInitialZoom] = useState<number>(1);
  
  // Download popup state
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{url: string, filename: string} | null>(null);
  
  // Optimization state
  const [qualitySlider, setQualitySlider] = useState<number>(90);
  const [targetSizeSlider, setTargetSizeSlider] = useState<number>(50);
  const [optimizedUrl, setOptimizedUrl] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Touch gesture functions
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
      setInitialZoom(zoomLevel);
      e.preventDefault();
    }
  }, [zoomLevel]);

  const handlePinchZoom = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scale = distance / lastTouchDistance;
        const newZoom = Math.max(0.5, Math.min(3, initialZoom * scale));
        setZoomLevel(newZoom);
      }
      e.preventDefault();
      return;
    }
  }, [lastTouchDistance, initialZoom]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  }, []);

  // Attach event listeners
  useEffect(() => {
    const container = cropContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handlePinchZoom, { passive: false });
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handlePinchZoom);
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleTouchStart, handlePinchZoom, handleWheel]);

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
    if (!dragStart || !cropArea || !cropContainerRef.current) return;
    
    const containerRect = cropContainerRef.current.getBoundingClientRect();
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    if (isDragging) {
      // Move crop area within container bounds
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
        newX = Math.max(0, cropArea.x - widthChange);
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = Math.max(50, Math.min(containerRect.height - cropArea.y, cropArea.height + deltaY));
      }
      if (resizeHandle.includes('top')) {
        const heightChange = -deltaY;
        newHeight = Math.max(50, cropArea.height + heightChange);
        newY = Math.max(0, cropArea.y - heightChange);
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

  const handleCropTouchMove = useCallback((e: TouchEvent) => {
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
      document.addEventListener('touchmove', handleCropTouchMove, options);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleCropTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleCropTouchMove, handleMouseUp]);

  const applyCrop = async () => {
    if (!selectedFile || !cropArea || !cropImageRef.current) return;

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = cropImageRef.current;
      
      // Get the actual displayed image dimensions
      const displayedWidth = img.offsetWidth;
      const displayedHeight = img.offsetHeight;
      
      // Calculate the scale factor between displayed image and actual image
      const scaleX = img.naturalWidth / displayedWidth;
      const scaleY = img.naturalHeight / displayedHeight;
      
      // Convert crop area coordinates to actual image coordinates
      const actualCropX = cropArea.x * scaleX;
      const actualCropY = cropArea.y * scaleY;
      const actualCropWidth = cropArea.width * scaleX;
      const actualCropHeight = cropArea.height * scaleY;
      
      // Ensure crop area is within image bounds
      const clampedX = Math.max(0, Math.min(actualCropX, img.naturalWidth - 1));
      const clampedY = Math.max(0, Math.min(actualCropY, img.naturalHeight - 1));
      const clampedWidth = Math.max(1, Math.min(actualCropWidth, img.naturalWidth - clampedX));
      const clampedHeight = Math.max(1, Math.min(actualCropHeight, img.naturalHeight - clampedY));
      
      // Set canvas size to the cropped dimensions
      canvas.width = clampedWidth;
      canvas.height = clampedHeight;
      
      // Draw the cropped portion of the image
      ctx.drawImage(
        img,
        clampedX,
        clampedY,
        clampedWidth,
        clampedHeight,
        0,
        0,
        clampedWidth,
        clampedHeight
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
    
    const filename = `processed-image.${outputFormat}`;
    setPendingDownload({ url: downloadUrl, filename });
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
    }
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
        {/* ==================== MOBILE TOP AD AREA - START ==================== */}
        <div className="block lg:hidden mb-6">
          {/* PASTE YOUR AD SCRIPT HERE */}
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : 'YOUR_AD_KEY_HERE',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
            `
          }} />
          {/* PASTE YOUR AD SCRIPT ABOVE */}
        </div>
        {/* ==================== MOBILE TOP AD AREA - END ==================== */}
        
        {/* ==================== DESKTOP TOP AD AREA - START ==================== */}
        <div className="hidden lg:block mb-6">
          {/* PASTE YOUR AD SCRIPT HERE */}
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : 'YOUR_AD_KEY_HERE',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
            `
          }} />
          {/* PASTE YOUR AD SCRIPT ABOVE */}
        </div>
        {/* ==================== DESKTOP TOP AD AREA - END ==================== */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ==================== LEFT SIDEBAR AD AREA - START ==================== */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              {/* PASTE YOUR AD SCRIPT HERE */}
              <div dangerouslySetInnerHTML={{
                __html: `
                  <script type="text/javascript">
                    atOptions = {
                      'key' : 'YOUR_AD_KEY_HERE',
                      'format' : 'iframe',
                      'height' : 600,
                      'width' : 160,
                      'params' : {}
                    };
                  </script>
                  <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
                `
              }} />
              {/* PASTE YOUR AD SCRIPT ABOVE */}
            </div>
          </div>
          {/* ==================== LEFT SIDEBAR AD AREA - END ==================== */}
          
          {/* Main Content */}
          <div className="lg:col-span-2">
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
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2">
                      {aspectRatios.map((ratio) => (
                        <div
                          key={ratio.value}
                          onClick={() => handleCropAspectRatioChange(ratio.value)}
                          className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                            cropAspectRatio === ratio.value 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-border hover:border-blue-300 bg-background'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <ratio.icon className={`w-4 h-4 ${cropAspectRatio === ratio.value ? 'text-blue-500' : 'text-muted-foreground'}`} />
                            <div className={`text-xs font-medium ${cropAspectRatio === ratio.value ? 'text-blue-500' : 'text-foreground'}`}>
                              {ratio.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Crop Area */}
                <Card className="solid-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground">
                        {croppedUrl ? "Cropped Result" : "Drag to Crop"}
                      </CardTitle>
                      {!croppedUrl && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoomLevel(Math.max(0.1, zoomLevel - 0.1))}
                            disabled={zoomLevel <= 0.1}
                          >
                            -
                          </Button>
                          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                            {Math.round(zoomLevel * 100)}%
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
                            disabled={zoomLevel >= 3}
                          >
                            +
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
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
                      <div className="space-y-0">
                        <div 
                          ref={cropContainerRef} 
                          className="relative bg-gray-900 overflow-hidden w-full touch-manipulation"
                          style={{ 
                            touchAction: 'manipulation',
                            height: '70vh',
                            minHeight: '500px',
                            userSelect: 'none'
                          }}
                          onTouchStart={(e) => {
                            if (e.touches.length === 2) {
                              e.preventDefault();
                              const distance = Math.sqrt(
                                Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) + 
                                Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
                              );
                              setLastTouchDistance(distance);
                              setInitialZoom(zoomLevel);
                            }
                          }}
                          onTouchMove={(e) => {
                            if (e.touches.length === 2) {
                              e.preventDefault();
                              const distance = Math.sqrt(
                                Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) + 
                                Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
                              );
                              if (lastTouchDistance > 0) {
                                const scale = distance / lastTouchDistance;
                                const newZoom = Math.max(0.1, Math.min(3, initialZoom * scale));
                                setZoomLevel(newZoom);
                              }
                            }
                          }}
                          onWheel={(e) => {
                            if (e.ctrlKey || e.metaKey) {
                              e.preventDefault();
                              const delta = e.deltaY > 0 ? -0.1 : 0.1;
                              setZoomLevel(prev => Math.max(0.1, Math.min(3, prev + delta)));
                            }
                          }}
                        >
                          <img 
                            ref={cropImageRef}
                            src={previewUrl} 
                            alt="Original" 
                            className="absolute select-none pointer-events-none"
                            draggable={false}
                            style={{
                              left: '50%',
                              top: '50%',
                              maxWidth: 'none',
                              maxHeight: 'none',
                              width: 'auto',
                              height: 'auto',
                              transform: `translate(-50%, -50%) scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`
                            }}
                            onLoad={() => {
                              // Initialize crop area and fit image after image loads
                              setTimeout(() => {
                                if (cropContainerRef.current && cropImageRef.current && !cropArea) {
                                  const container = cropContainerRef.current;
                                  const image = cropImageRef.current;
                                  const containerRect = container.getBoundingClientRect();
                                  
                                  // Calculate zoom to fit image in container
                                  const scaleX = containerRect.width / image.naturalWidth;
                                  const scaleY = containerRect.height / image.naturalHeight;
                                  const fitScale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some margin
                                  
                                  setZoomLevel(fitScale);
                                  
                                  const size = Math.min(containerRect.width, containerRect.height) * 0.4;
                                  setCropArea({
                                    x: (containerRect.width - size) / 2,
                                    y: (containerRect.height - size) / 2,
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
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { format: 'jpeg', label: 'JPEG', icon: ImageIcon },
                          { format: 'png', label: 'PNG', icon: ImageIcon },
                          { format: 'webp', label: 'WebP', icon: ImageIcon },
                          { format: 'gif', label: 'GIF', icon: ImageIcon },
                          { format: 'bmp', label: 'BMP', icon: ImageIcon }
                        ].map(({ format, label, icon: Icon }) => (
                          <Button
                            key={format}
                            onClick={() => setOutputFormat(format)}
                            variant={outputFormat === format ? "default" : "outline"}
                            size="sm"
                            className="h-12 flex-col gap-1"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs">{label}</span>
                          </Button>
                        ))}
                      </div>
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

        {/* Information Section */}
        <Card className="solid-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">About Image Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The Image Tool provides comprehensive image editing capabilities including resizing, cropping, format conversion, and optimization. 
                All processing happens locally in your browser for maximum privacy and speed.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Resize Features:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Custom width and height input</li>
                    <li>• Maintain aspect ratio option</li>
                    <li>• Real-time preview updates</li>
                    <li>• Instant file size calculation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Crop Options:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• 12+ aspect ratio presets</li>
                    <li>• Visual drag-and-drop cropping</li>
                    <li>• Touch-friendly mobile interface</li>
                    <li>• Perfect for social media sizes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Convert & Optimize:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Support for JPEG, PNG, WebP, GIF, BMP</li>
                    <li>• Quality adjustment slider</li>
                    <li>• File size optimization</li>
                    <li>• Lossless and lossy compression</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm">
                <strong>Privacy Note:</strong> All image processing happens entirely in your browser. Your images are never uploaded 
                to any server, ensuring complete privacy and security of your files.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ==================== MOBILE BOTTOM AD AREA - START ==================== */}
        <div className="block lg:hidden mt-8">
          {/* PASTE YOUR AD SCRIPT HERE */}
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : 'YOUR_AD_KEY_HERE',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
            `
          }} />
          {/* PASTE YOUR AD SCRIPT ABOVE */}
        </div>
        {/* ==================== MOBILE BOTTOM AD AREA - END ==================== */}
      </div>
      
      {/* ==================== RIGHT SIDEBAR AD AREA - START ==================== */}
      <div className="hidden lg:block">
        <div className="sticky top-4">
          {/* PASTE YOUR AD SCRIPT HERE */}
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : 'YOUR_AD_KEY_HERE',
                  'format' : 'iframe',
                  'height' : 600,
                  'width' : 160,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
            `
          }} />
          {/* PASTE YOUR AD SCRIPT ABOVE */}
        </div>
      </div>
      {/* ==================== RIGHT SIDEBAR AD AREA - END ==================== */}
    </div>

        {/* ==================== DESKTOP BOTTOM AD AREA - START ==================== */}
        <div className="hidden lg:block mt-8">
          {/* PASTE YOUR AD SCRIPT HERE */}
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript">
                atOptions = {
                  'key' : 'YOUR_AD_KEY_HERE',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
            `
          }} />
          {/* PASTE YOUR AD SCRIPT ABOVE */}
        </div>
        {/* ==================== DESKTOP BOTTOM AD AREA - END ==================== */}
      </div>
      
      {/* Download Popup with Ads and Timer */}
      <DownloadPopup
        isOpen={showDownloadPopup}
        onClose={() => setShowDownloadPopup(false)}
        onDownload={executeDownload}
        filename={pendingDownload?.filename || "processed-image.png"}
      />
    </div>
  );
}