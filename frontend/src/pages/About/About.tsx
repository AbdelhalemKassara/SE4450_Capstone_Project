import CdemHeader from "../HomePage/Header/CdemHeader";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import Button from "@mui/material/Button";
import { yellow } from "@mui/material/colors";

const About = () => {
  const navigateTo = useNavigate();

  return (
    <div id="about_page">
      <CdemHeader />
      <div className="about_body">
        <div className="background_bar">
          Capstone Project: Ethan Miranda, Varnesh Vasudevan, Li Qian Zhou,
          Johnson Yong, and Abdelhalem Kassara
        </div>
      </div>
    </div>
  );
};

export default About;
