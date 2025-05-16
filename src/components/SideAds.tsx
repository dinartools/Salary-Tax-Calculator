import Adsense from "./Adsense";

const SideAds = () => (
  <>
    <div style={{
      position: "fixed",
      top: "100px",
      left: "0",
      zIndex: 1000,
      width: "160px",
      height: "600px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Adsense />
    </div>
    <div style={{
      position: "fixed",
      top: "100px",
      right: "0",
      zIndex: 1000,
      width: "160px",
      height: "600px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Adsense />
    </div>
  </>
);

export default SideAds; 