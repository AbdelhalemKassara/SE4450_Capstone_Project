'use client'
import { createContext } from "react";
import csvQuery from "./csvQuery";
import FileFetcher from './FileFetcher';

export const DatabaseContext = createContext(new csvQuery());
let fileFetcher = new FileFetcher();
await fileFetcher.init();
export const FileFetcherTest = createContext(fileFetcher);
