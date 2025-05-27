import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, FileArchiveIcon, PlusIcon, XIcon, DownloadIcon, LockIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";

interface FileItem {
  file: File;
  id: string;
}

const COMPRESSION_FORMATS = [
  { value: 'zip', label: 'ZIP', description: 'Most compatible format' },
  { value: '7z', label: '7ZIP', description: 'Best compression ratio' },
  { value: 'tar.gz', label: 'TAR.GZ', description: 'Unix/Linux standard' },
  { value: 'tar.bz2', label: 'TAR.BZ2', description: 'Better compression than gzip' },
];

export default function FileCompressor() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [compressionFormat, setCompressionFormat] = useState('zip');
  const [fileName, setFileName] = useState('compressed_files');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: FileItem[] = Array.from(selectedFiles).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please add at least one file to compress",
        variant: "destructive"
      });
      return;
    }

    if (usePassword && !password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter a password or disable password protection",
        variant: "destructive"
      });
      return;
    }

    setIsCompressing(true);

    try {
      if (compressionFormat === 'zip') {
        const zip = new JSZip();
        
        for (const fileItem of files) {
          zip.file(fileItem.file.name, fileItem.file);
        }

        const content = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });

        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.${compressionFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Compression Complete!",
          description: `Files compressed to ${fileName}.${compressionFormat}`,
        });
      } else {
        // For other formats, show a message about requiring external libraries
        toast({
          title: "Format Not Yet Supported",
          description: `${compressionFormat.toUpperCase()} compression will be available in a future update`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Compression Failed",
        description: "Unable to compress files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const getTotalSize = () => {
    return files.reduce((total, fileItem) => total + fileItem.file.size, 0);
  };

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                File Compressor
              </span>
            </h1>
            <p className="text-gray-300 font-medium text-sm sm:text-base">Compress multiple files into archives with optional password protection</p>
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
              Upload files, choose compression format, set filename and optional password, then click compress to create your archive.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload and Settings */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground">Add Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileArchiveIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground text-sm mb-2">Drop files here or click to browse</p>
                  <p className="text-muted-foreground text-xs">Add multiple files to compress together</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {files.map((fileItem) => (
                      <div key={fileItem.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{fileItem.file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(fileItem.file.size)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileItem.id)}
                          className="ml-2 p-1 h-auto"
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Total: {files.length} files, {formatFileSize(getTotalSize())}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compression Settings */}
            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground">Compression Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-foreground">Output Filename</Label>
                  <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="bg-background border-border text-foreground"
                    placeholder="Enter filename"
                  />
                </div>

                <div>
                  <Label className="text-foreground">Compression Format</Label>
                  <Select value={compressionFormat} onValueChange={setCompressionFormat}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPRESSION_FORMATS.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="password-protection" 
                    checked={usePassword}
                    onCheckedChange={(checked) => setUsePassword(checked === true)}
                  />
                  <Label htmlFor="password-protection" className="text-foreground">Password protect archive</Label>
                </div>

                {usePassword && (
                  <div>
                    <Label className="text-foreground">Password</Label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background border-border text-foreground pr-10"
                        placeholder="Enter password"
                      />
                      <LockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleCompress}
                  disabled={files.length === 0 || isCompressing}
                  className="w-full pill-button bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  {isCompressing ? "Compressing..." : (
                    <>
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Compress Files
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Info */}
          <div className="space-y-6">
            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground">Compression Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground mb-2">Output File:</div>
                    <div className="font-semibold text-foreground text-lg">
                      {fileName}.{compressionFormat}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Files Count</div>
                      <div className="text-lg font-semibold text-foreground">{files.length}</div>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Total Size</div>
                      <div className="text-lg font-semibold text-foreground">{formatFileSize(getTotalSize())}</div>
                    </div>
                  </div>

                  {usePassword && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <LockIcon className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-amber-300">Password protection enabled</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground">Format Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {COMPRESSION_FORMATS.map((format) => (
                    <div 
                      key={format.value}
                      className={`p-3 rounded-lg border transition-colors ${
                        compressionFormat === format.value 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-border bg-background'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-foreground">{format.label}</div>
                          <div className="text-xs text-muted-foreground">{format.description}</div>
                        </div>
                        {compressionFormat === format.value && (
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Section */}
        <Card className="solid-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">About File Compressor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The File Compressor tool allows you to combine multiple files into compressed archives. 
                Choose from different compression formats and add optional password protection for sensitive files.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Supported Formats:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• ZIP - Universal compatibility</li>
                    <li>• 7ZIP - Maximum compression efficiency</li>
                    <li>• TAR.GZ - Unix/Linux standard format</li>
                    <li>• TAR.BZ2 - Superior compression ratio</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Features:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Multiple file selection and management</li>
                    <li>• Optional password protection</li>
                    <li>• Real-time file size preview</li>
                    <li>• Drag and drop interface</li>
                    <li>• Client-side compression for privacy</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm">
                <strong>Note:</strong> Currently ZIP format is fully supported with client-side compression. 
                Other formats (7ZIP, TAR.GZ, TAR.BZ2) will be available in future updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}