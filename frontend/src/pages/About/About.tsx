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
          <span>
            This website was built as a 4th year capstone project at the
            University of Western Ontario in collaboration with the Consortium
            on Electoral Democracy. Designed to be an interactive tool to assist
            in the analysis of public opinion surveys, this app allows the user
            to select a dataset, select various survey questions, apply filters
            and analyse the data using graphs, and a heat map.
          </span>
          <span>
            Special thanks to Ethan Miranda, Johnson Yong, Li Qian Zhou,
            Abdelhalem Kassara, and Varnesh Vasudevan.
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;
