import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import mapleLeaf from "./Maple_Leaf.png";
import { useNavigate } from 'react-router-dom';
import { yellow } from '@mui/material/colors';

import "./index.scss";

const CdemHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigateTo = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNextPage = () => {
    handleClose();
    navigateTo("/dataAnalysisTool")
  }

  return (
    <div className="cdem_header">
      <div className="mapleLeaf_header">
        <img src={mapleLeaf} className="leaf" alt="maple leaf" />
      </div>
      <div className ='title_header'>
        <span>Canadian</span>
        <span>Democracy</span>
        <span>Research</span>
      </div>
      <div className="header_menu">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MenuIcon fontSize="large" style={{ color: yellow[700] }} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleNextPage}>Map</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default CdemHeader;
