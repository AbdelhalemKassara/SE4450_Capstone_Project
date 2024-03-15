import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import HomePage from "./pages/HomePage/HomePage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from "./pages/DataAnalysisTool/DataAnalysisTool.tsx";
import SelectionTool from './pages/SelectionTool/selectionTool';
// import DropdownMenu from './components/DropdownMenu.tsx';
import PageNotFound from "./pages/404/PageNotFound.tsx";
import LandingPage from "./pages/LandingPage/landingPage.tsx";
import "./index.css";
import Export from "./pages/chart/export.tsx"
import MapComponent from './pages/MapComponent/MapComponent.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataAnalysisTool" element={<DataAnalysisTool />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/selection" element={<SelectionTool />} />
        <Route path="/bar" element={<LandingPage />} />
        <Route path="/chart" element={<Export />}/>
        <Route path="/maptest" element={<MapComponent />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
