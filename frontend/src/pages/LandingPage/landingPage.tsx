import { useContext, useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import DropdownMenu from '../../components/DropdownMenu';
import { DatabaseContext } from "../../components/DatabaseContext";
import * as React from 'react';
import './landingPage.css'

export default function LandingPage() {
  const database = useContext(DatabaseContext);

  return (

    <>
      <div>
        Hello World
      </div>

    </>

  )
}


