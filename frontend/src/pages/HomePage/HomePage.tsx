import CdemHeader from './Header/CdemHeader';
import './index.scss';
import backgroundLeaf from "./Background_leaf.png";

const HomePage = () => {

  return (
    <div id = 'cdem_homepage'>
      <CdemHeader/>
      <div className = 'homePage_body'>
        <div className = 'background_bar'>
          <div className='background_text'>
            <span>Democracy</span>
            <span>Starts</span>
            <span>Here</span>
          </div>
          <div className="mapleLeaf_header"/>
        </div>
      </div>
    </div>
  )
}

export default HomePage

