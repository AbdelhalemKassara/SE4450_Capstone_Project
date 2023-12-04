import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import LandingPage from './pages/LandingPage/landingPage.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataAnalysisTool from './pages/DataAnalysisTool/DataAnalysisTool.tsx';
import PageNotFound from './pages/404/PageNotFound.tsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dataAnalysisTool" element={<DataAnalysisTool />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
