import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import IndustrialParksProjectPage from "./components/IndustrialParksProjectPage";
import "./index.css";

function IndustrialParksApp() {
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <IndustrialParksProjectPage
      language={language}
      onBack={() => {
        window.location.href = "./";
      }}
      onToggleLanguage={setLanguage}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IndustrialParksApp />
  </React.StrictMode>,
);
