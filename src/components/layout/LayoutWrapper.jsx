// src/components/layout/LayoutWrapper.jsx
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import BottomNavbar from "./BottomNavbar";

export default function LayoutWrapper({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
        {/* Mobile Bottom Navbar */}
        {isMobile && <BottomNavbar />}
      </div>
    </div>
  );
}