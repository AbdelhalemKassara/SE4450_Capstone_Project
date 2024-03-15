'use client'
import { createContext } from "react";
import csvQuery from "./csvQuery";
import FileFetcher from './FileFetcher';
import DatasetQuery from './DatasetQuery';

export const DatabaseContext = createContext(new csvQuery());

let fileFetcher = new FileFetcher();
await fileFetcher.init();

export const FileFetcherTest = createContext(fileFetcher);

let datasetQueryTemp = new DatasetQuery();
await datasetQueryTemp.init();
export const datasetQuery = createContext(datasetQueryTemp);