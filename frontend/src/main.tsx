import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import CdemPage from "./pages/CdemPage/CdemPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from "./pages/DataAnalysisTool/DataAnalysisTool.tsx";
import SelectionTool from './pages/SelectionTool/selectionTool';
// import DropdownMenu from './components/DropdownMenu.tsx';
import PageNotFound from "./pages/404/PageNotFound.tsx";
import LandingPage from "./pages/LandingPage/landingPage.tsx";
import "./index.css";
<<<<<<< HEAD
import MapComponent from './pages/MapComponent/MapComponent.tsx';
=======
import Export from "./pages/chart/export.tsx"
>>>>>>> main

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
<<<<<<< HEAD
        <Route path="/maptest" element={<MapComponent />} />
=======
        <Route path="/chart" element={<Export />}/>
>>>>>>> main
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
