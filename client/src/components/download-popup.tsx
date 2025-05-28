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
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="p-4 pt-2 space-y-4">
          {/* ==================== TOP POPUP AD AREA - START ==================== */}
          <div>
            {/* PASTE YOUR AD SCRIPT HERE */}
            <div dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript">
                  atOptions = {
                    'key' : 'YOUR_AD_KEY_HERE',
                    'format' : 'iframe',
                    'height' : 100,
                    'width' : 320,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
              `
            }} />
            {/* PASTE YOUR AD SCRIPT ABOVE */}
          </div>
          {/* ==================== TOP POPUP AD AREA - END ==================== */}

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

          {/* ==================== BOTTOM POPUP AD AREA - START ==================== */}
          <div>
            {/* PASTE YOUR AD SCRIPT HERE */}
            <div dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript">
                  atOptions = {
                    'key' : 'YOUR_AD_KEY_HERE',
                    'format' : 'iframe',
                    'height' : 75,
                    'width' : 300,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_AD_KEY_HERE/invoke.js"></script>
              `
            }} />
            {/* PASTE YOUR AD SCRIPT ABOVE */}
          </div>
          {/* ==================== BOTTOM POPUP AD AREA - END ==================== */}

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