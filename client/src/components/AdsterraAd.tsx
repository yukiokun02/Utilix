import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdsterraAd({ adKey, width, height, className = '' }: AdsterraAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Create a unique ID for this ad instance
    const uniqueId = Math.random().toString(36).substr(2, 9);
    
    // Create the HTML content exactly as Adsterra expects
    const adHTML = `
      <script type="text/javascript">
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"></script>
    `;

    // Insert the ad HTML directly
    adRef.current.innerHTML = adHTML;

    // Execute the scripts manually
    const scripts = adRef.current.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      newScript.type = script.type || 'text/javascript';
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      } else {
        newScript.textContent = script.textContent;
      }
      script.parentNode?.replaceChild(newScript, script);
    });

    console.log('Adsterra ad initialized for key:', adKey);

  }, [adKey, width, height]);

  return (
    <div 
      ref={adRef}
      className={`adsterra-ad ${className}`}
      style={{ 
        minHeight: height, 
        width: width, 
        margin: '0 auto',
        textAlign: 'center',
        display: 'block'
      }}
    />
  );
}