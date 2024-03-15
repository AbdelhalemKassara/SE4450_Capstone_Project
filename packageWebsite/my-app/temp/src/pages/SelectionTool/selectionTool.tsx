import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import * as React from 'react';
import { Dispatch, SetStateAction } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useContext, useEffect } from "react";
import { datasetQuery } from "../../components/DatabaseContext";
import './selectionTool.css';


export default function SelectionTool({ dataset, setDataset, setIndVar, setDepVar}: { setIndVar: React.Dispatch<React.SetStateAction<string| undefined>>, setDepVar: React.Dispatch<React.SetStateAction<string| undefined>>, setDataset: React.Dispatch<React.SetStateAction<string| undefined>>, dataset: (string | undefined) }): JSX.Element {

    const datasetQ = useContext(datasetQuery);

    const [datasets, setDatasets] = useState<string[]>([]);

    useEffect(() => {
        datasetQ.getDatasetsNames().then((val: string[]) => {
            setDatasets(val);
        });
    }, []);


    return (
        <div className="container">
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">DataSet Year</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dataset ? dataset : ''}
                label="DataSet Years"
                onChange={(event: SelectChangeEvent) => {
                    setDataset(event.target.value);
                    setDepVar(undefined);
                    setIndVar(undefined);        
                }}>
                {(() => {
                    let out: JSX.Element[] = [];
                    datasets.forEach((value) => {
                        out.push(<MenuItem value={value} key={value}>{value}</MenuItem>)
                    })
                    return out;
                })()}

            </Select>
        </FormControl>
        </div>
    );
}


