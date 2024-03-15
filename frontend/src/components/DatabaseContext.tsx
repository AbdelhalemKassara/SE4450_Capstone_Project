'use client'
import { createContext } from "react";
import DatasetQuery from './DatasetQuery';


let datasetQueryTemp = new DatasetQuery();
(async () => {
  await datasetQueryTemp.init();
})();
export const datasetQuery = createContext(datasetQueryTemp);