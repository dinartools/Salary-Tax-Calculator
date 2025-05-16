import { useEffect, useRef } from "react";

const Adsense = () => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 動態載入 Adsense script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7453295555493346";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    // 嘗試渲染廣告
    if ((window as any).adsbygoogle && adRef.current) {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        // 忽略重複 push 的錯誤
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-7453295555493346"
      data-ad-slot="1583409901"
      data-ad-format="auto"
      data-full-width-responsive="true"
      ref={adRef}
    ></ins>
  );
};

export default Adsense; 