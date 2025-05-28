import { useEffect, useRef } from 'react';

export default function AdsterraAdMobile() {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    // Create the configuration script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key' : '9713846a01389bccb7945a5638e800ae',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    // Create the Adsterra invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/9713846a01389bccb7945a5638e800ae/invoke.js';
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
      className="absolute top-2 left-4 right-4 z-20 block lg:hidden"
    />
  );
}