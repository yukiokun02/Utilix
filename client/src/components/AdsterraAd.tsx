import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdsterraAd({ adKey, width, height, className = '' }: AdsterraAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!adRef.current || scriptLoadedRef.current) return;

    // Create unique variable name to avoid conflicts
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const optionsVar = `atOptions_${uniqueId}`;
    
    // Set options on window object
    (window as any)[optionsVar] = {
      'key': adKey,
      'format': 'iframe',
      'height': height,
      'width': width,
      'params': {}
    };

    // Create and load the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    script.async = true;
    
    script.onload = () => {
      console.log('Adsterra script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('Failed to load Adsterra script');
    };

    adRef.current.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      // Cleanup
      if ((window as any)[optionsVar]) {
        delete (window as any)[optionsVar];
      }
    };
  }, [adKey, width, height]);

  return (
    <div 
      ref={adRef}
      className={`adsterra-ad ${className}`}
      style={{ 
        minHeight: height, 
        width: width, 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Fallback content while ad loads */}
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        textAlign: 'center',
        padding: '10px'
      }}>
        Loading ad...
      </div>
    </div>
  );
}