import { useEffect, useRef } from 'react';

export default function AdsterraAdDesktop() {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    // Create the configuration script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key' : 'cb2ed6205d66bc197d403ba9e8a43db6',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // Create the Adsterra invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/cb2ed6205d66bc197d403ba9e8a43db6/invoke.js';
    invokeScript.async = true;

    // Append scripts to the ad container
    adContainerRef.current.appendChild(configScript);
    adContainerRef.current.appendChild(invokeScript);

    // Cleanup function
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={adContainerRef}
      className="hidden lg:block mb-8"
    />
  );
}