import React, { createContext, useContext, useState, useEffect } from "react";

const AdContext = createContext();

export const AdProvider = ({ children }) => {
  const [showAd, setShowAd] = useState(true);

  // Reset localStorage to show the ad on every refresh
  useEffect(() => {
    localStorage.setItem("showTopAdMobile", "true");
    setShowAd(true); // Ensure state is in sync with localStorage
  }, []); // Runs once on mount

  const closeAd = () => {
    setShowAd(false); // Update state to hide ad
    localStorage.setItem("showTopAdMobile", "false"); // Persist hide state
  };

  return (
    <AdContext.Provider value={{ showAd, closeAd}}>
      {children}
    </AdContext.Provider>
  );
};

export const useAd = () => useContext(AdContext);
