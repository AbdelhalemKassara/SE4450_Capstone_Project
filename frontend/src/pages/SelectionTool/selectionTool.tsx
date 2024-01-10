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
import { DatabaseContext } from "../../components/DatabaseContext";
import Button from '@mui/material/Button';


export default function SelectionTool({ dataset, setDataset }: { setDataset: React.Dispatch<React.SetStateAction<string>>, dataset: string }): JSX.Element {

    const database = useContext(DatabaseContext);
    const [datasets, setDatasets] = useState<string[]>([]);

    useEffect(() => {
        database.getDatasetsNames().then((val) => {
            setDatasets(val);
        });
    }, []);


    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">DataSet Year</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dataset}
                label="DataSet Years"
                onChange={(event: SelectChangeEvent) => {
                    setDataset(event.target.value);
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
    );
}


