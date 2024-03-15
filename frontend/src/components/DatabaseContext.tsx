'use client'
import { createContext } from "react";
import csvQuery from "./csvQuery";
import FileFetcher from './FileFetcher';
import DatasetQuery from './DatasetQuery';

export const DatabaseContext = createContext(new csvQuery());

let datasetQueryTemp = new DatasetQuery();
(async () => {
  await datasetQueryTemp.init();
})();
export const datasetQuery = createContext(datasetQueryTemp);