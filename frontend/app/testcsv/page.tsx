'use client'
import csvQuery from "@/components/csvQuery";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    let test = new csvQuery();
  }, []);
  return (<>
    <p>test</p>
  </>)
}