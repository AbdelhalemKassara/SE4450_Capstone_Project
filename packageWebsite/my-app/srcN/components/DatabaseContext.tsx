'use client'
import { createContext } from "react";
import csvQuery from "./csvQuery";
import DatasetQuery from './DatasetQuery';

export const DatabaseContext = createContext(new csvQuery());




let datasetQueryTemp = new DatasetQuery();
datasetQueryTemp.init();
export const datasetQuery = createContext(datasetQueryTemp);