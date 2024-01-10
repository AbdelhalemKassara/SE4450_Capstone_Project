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



interface SelectionToolProps {
    dataset: string;
    setDataset: Dispatch<SetStateAction<string>>;
}

export default function SelectionTool({ dataset, setDataset }: SelectionToolProps) {
    const [Year, setYear] = useState<string>('');
    const database = useContext(DatabaseContext);
    //fetch function 
    const fetchData = async () => {
        try {
            const datasetsNames = await database.getDatasetsNames();
            setError(false);
        } catch (error) {
            console.error('Error fetching dataset names:', error);
        }
    };

    //function that sets the setDataset
    const handleChange = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };

    //based on what year the user chose, call the dataset. 
    const onYearChange = () => {
        setDataset(database);
        console.log("Year:", Year);
    };

    //Alignment CSS
    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Adjust the height as needed
    };

    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Selected Year</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={Year}
                    onChange={handleChange}
                    label="Year"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                    <MenuItem value={2022}>2022</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" onClick={onYearChange}>
                Send
            </Button>
        </div>
    );
}


