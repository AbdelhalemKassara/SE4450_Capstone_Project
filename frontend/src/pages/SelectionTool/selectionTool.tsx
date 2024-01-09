import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useContext, useEffect } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";
import Button from '@mui/material/Button';




export default function SelectionTool() {
    const [Year, setYear] = React.useState('');
    const [error, setError] = React.useState(false);
    const database = useContext(DatabaseContext);
    const handleChange = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };
    const fetchData = async () => {
        try {
            const datasetsNames = await database.getDatasetsNames();

            setError(false);
        } catch (error) {
            console.error('Error fetching dataset names:', error);
        }
    };

    const handleSendClick = async () => {
        console.log("Selected Year:", Year);
        const selectedYear = parseInt(Year, 10);

        if (selectedYear === 2020) {
            console.log("Year 2020");
            //create database logic 

        } else if (selectedYear === 2021) {
            console.log("Year 2021");
            //create database logic
        } else if (selectedYear === 2022) {
            console.log("Year 2022");
            //create database logic
            await fetchData();
            console.log(database.getDatasetsNames());
            setError(false);
        }
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
                    label="Age"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                    <MenuItem value={2022}>2022</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSendClick} >
                Send
            </Button>
        </div>
    );
}


