import * as React from "react";
import cdemLogo from "../cdem_logo.jpg";
import { useNavigate } from "react-router-dom";
import { yellow } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

import "./index.scss";

const CdemHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigateTo = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToCDem = () => {
    window.location.href = "https://c-dem.ca/";
  };

  const navigatePage = (url: string) => {
    navigateTo(url);
  };

  return (
    <div className="cdem_header">
      <div className="mapleLeaf_header" onClick={navigateToCDem}>
        <img src={cdemLogo} className="leaf" alt="maple leaf" />
      </div>
      <div className="title_header">
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
          <MenuItem
            onClick={() => {
              navigatePage("/");
            }}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigatePage("/dataAnalysisTool");
            }}
          >
            Politcal Data
          </MenuItem>
          <MenuItem onClick={navigateToCDem}>Visit CDem</MenuItem>
          <MenuItem
            onClick={() => {
              navigatePage("/about");
            }}
          >
            About Us
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default CdemHeader;
