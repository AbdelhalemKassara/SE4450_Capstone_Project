// import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './pages/LandingPage/landingPage.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from './pages/DataAnalysisTool/DataAnalysisTool.tsx';
import PageNotFound from './pages/404/PageNotFound.tsx';
import SelectionTool from './pages/SelectionTool/selectionTool.tsx';
import './index.css'
import * as React from 'react';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/selection" element={<SelectionTool />} />
        <Route path="/dataAnalysisTool" element={<DataAnalysisTool />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
