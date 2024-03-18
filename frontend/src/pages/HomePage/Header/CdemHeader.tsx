import * as React from "react";
import mapleLeaf from "./Maple_Leaf.png";
import { useNavigate } from 'react-router-dom';

import "./index.scss";

const CdemHeader = () => {
  const navigateTo = useNavigate();

  const handleHomePage = () => {
    navigateTo("/")
  }

  return (
    <div className="cdem_header">
      <div className="mapleLeaf_header" onClick={handleHomePage}>
        <img src={mapleLeaf} className="leaf" alt="maple leaf" />
      </div>
      <div className='title_header'>
        <span>Canadian</span>
        <span>Democracy</span>
        <span>Research</span>
      </div>
    </div>
  );
};

export default CdemHeader;
