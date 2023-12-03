import { useState } from 'react'
import CdemHeader from './Header/CdemHeader';
import './index.scss';

const HomePage = () => {

  return (
    <div id = 'cdem_homepage'>
      <CdemHeader/>
      <div className = 'homePage_body'>
        Layout to be decided
      </div>
    </div>
  )
}

export default HomePage

