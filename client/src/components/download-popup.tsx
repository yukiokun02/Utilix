import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DownloadIcon, XIcon } from "lucide-react";

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  filename: string;
}

export default function DownloadPopup({ isOpen, onClose, onDownload, filename }: DownloadPopupProps) {
  const [countdown, setCountdown] = useState(10);
  const [isDownloadReady, setIsDownloadReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      setIsDownloadReady(false);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsDownloadReady(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleDownload = () => {
    onDownload();
    onClose();
  };

  const progress = ((10 - countdown) / 10) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-0 gap-0 bg-gray-900 border-gray-700">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">Preparing Download</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4 pt-2 space-y-4">
          {/* Google AdSense Ad Space */}
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
            <div className="text-center text-gray-400 text-xs mb-2">Advertisement</div>
            <div className="bg-gray-700/30 rounded h-20 sm:h-24 flex items-center justify-center">
              <span className="text-xs text-gray-500">Google AdSense (320x100)</span>
            </div>
          </div>

          {/* Download Progress */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-white font-medium mb-1">
                {isDownloadReady ? "Download Ready!" : `Preparing your file...`}
              </p>
              <p className="text-gray-400 text-sm">{filename}</p>
            </div>
            
            {!isDownloadReady && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-gray-400 text-sm">
                  Ready in {countdown} seconds...
                </p>
              </div>
            )}
          </div>

          {/* Adsterra Ad Space */}
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
            <div className="text-center text-gray-400 text-xs mb-2">Advertisement</div>
            <div className="bg-gray-700/30 rounded h-16 sm:h-20 flex items-center justify-center">
              <span className="text-xs text-gray-500">Adsterra (300x75)</span>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={!isDownloadReady}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            {isDownloadReady ? "Download Now" : `Wait ${countdown}s`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}