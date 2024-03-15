import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import CdemPage from "./pages/CdemPage/CdemPage.js";
import HomePage from "./pages/HomePage/HomePage.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from "./pages/DataAnalysisTool/DataAnalysisTool.js";
import SelectionTool from './pages/SelectionTool/selectionTool.js';
// import DropdownMenu from './components/DropdownMenu.tsx';
import PageNotFound from "./pages/404/PageNotFound.js";
import LandingPage from "./pages/LandingPage/landingPage.js";
import "./index.css";
import Export from "./pages/chart/export.js"
import MapComponent from './pages/MapComponent/MapComponent.js';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataAnalysisTool" element={<DataAnalysisTool />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/cdemMap" element={<CdemPage />} />
        <Route path="/selection" element={<SelectionTool />} />
        <Route path="/bar" element={<LandingPage />} />
        <Route path="/chart" element={<Export />}/>
        <Route path="/maptest" element={<MapComponent />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
