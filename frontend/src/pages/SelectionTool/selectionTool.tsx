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
                    <MenuItem value={10}>2020</MenuItem>
                    <MenuItem value={20}>2021</MenuItem>
                    <MenuItem value={30}>2022</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-filled-label">Year</InputLabel>
                <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={Year}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>2020</MenuItem>
                    <MenuItem value={20}>2021</MenuItem>
                    <MenuItem value={30}>2022</MenuItem>


                </Select>
            </FormControl>
            <Button variant="contained" >
                Send
            </Button>
        </div>
    );
}


