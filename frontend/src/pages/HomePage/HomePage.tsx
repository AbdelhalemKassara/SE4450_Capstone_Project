import CdemHeader from "./Header/CdemHeader";
import "./index.scss";
import Button from "@mui/material/Button";
import CDemFooter from "./Footer/CdemFooter";
import { yellow } from "@mui/material/colors";

const HomePage = () => {
  return (
    <div id="cdem_homepage">
      <CdemHeader />
      <div className="homePage_body">
        <div className="background_bar">
          <div className="background_text">
            <span>Demo</span>
            <span>cracy</span>
            <span>Starts</span>
            <span>Here</span>
          </div>
          <div className="started_button">
            <Button
              id="basic-button"
              variant="contained"
              style={{ backgroundColor: yellow[700] }}
            >
              <span>View Democratic Data</span>
            </Button>
          </div>
        </div>
      </div>
      <CDemFooter />
    </div>
  );
};

export default HomePage;
