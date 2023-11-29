'use client'
import { createContext } from "react";
import csvQuery from "./csvQuery";

export const DatabaseContext = createContext(new csvQuery());

