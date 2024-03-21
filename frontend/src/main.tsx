import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import HomePage from "./pages/HomePage/HomePage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from "./pages/DataAnalysisTool/DataAnalysisTool.tsx";
// import DropdownMenu from './components/DropdownMenu.tsx';
import PageNotFound from "./pages/404/PageNotFound.tsx";
import "./index.css";
import Export from "./pages/chart/export.tsx"
import About from './pages/About/About.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataAnalysisTool" element={<DataAnalysisTool />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/chart" element={<Export />}/>
        <Route path="/about" element={<About />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
