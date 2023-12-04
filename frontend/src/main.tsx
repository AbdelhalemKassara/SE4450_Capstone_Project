import React from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './pages/LandingPage/LandingPage.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from './pages/DataAnalysisTool/DataAnalysisTool.tsx';
import PageNotFound from './pages/404/PageNotFound.tsx';
import selectionTool from './pages/SelectionTool/selectionTool.tsx';
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/selection" element={<selectionTool />} />
        <Route path="/dataAnalysisTool" element={<DataAnalysisTool />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
