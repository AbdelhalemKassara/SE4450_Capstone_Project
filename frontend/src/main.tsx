import React from "react";
import ReactDOM from "react-dom/client";
import CdemPage from "./pages/CdemPage/CdemPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from "./pages/DataAnalysisTool/DataAnalysisTool.tsx";
import PageNotFound from "./pages/404/PageNotFound.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataAnalysisTool" element={<DataAnalysisTool />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/cdemMap" element={<CdemPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
