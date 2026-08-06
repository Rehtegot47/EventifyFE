import { useState, useCallback, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("eventify_splash_seen");
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("eventify_splash_seen", "1");
    setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className={showSplash ? "h-screen overflow-hidden" : ""}>
        <AppRoutes />
      </div>
    </>
  );
}
