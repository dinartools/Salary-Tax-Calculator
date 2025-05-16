import React, { useEffect, useRef } from 'react';

const AdSenseBox: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 動態載入 script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7453295555493346';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    // 嘗試推送廣告
    if ((window as any).adsbygoogle && adRef.current) {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {}
    }
  }, []);

  return (
    <div style={{width:'100%'}}>
      <ins className="adsbygoogle"
        style={{display:'block'}}
        data-ad-client="ca-pub-7453295555493346"
        data-ad-slot="1583409901"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef as any}
      ></ins>
    </div>
  );
};

export default AdSenseBox; 