import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { useContext, useEffect } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";



export default function selectionTool() {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState('Choose wisely');
    const database = useContext(DatabaseContext);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
        setHelperText(' ');
        setError(false);
    };
    const fetchData = async () => {
        try {
            const datasetsNames = await database.getDatasetsNames();
            setHelperText(datasetsNames.join(', ')); // Assuming datasetsNames is an array of strings
            setError(false);
        } catch (error) {
            console.error('Error fetching dataset names:', error);
        }
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (value === '2019') {
            setHelperText('2019 Selcted');
            //use the 
            setError(false);
        } else if (value === '2020') {
            setHelperText('2020 Selcted');

            //setError is not needed, it just makes the words red
            setError(false);
        } else if (value === '2021') {
            setHelperText('2021 Selcted');
            setError(false);
        } else if (value === '2022') {
            await fetchData();
            console.log(database.getDatasetsNames());
            //setHelperText(database.getDatasetsNames());
            setError(false);
        }

        else {
            setHelperText('Please select an option.');
            setError(true);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormControl sx={{ m: 3 }} error={error} variant="standard">
                    <FormLabel id="demo-error-radios">Please Choose A Dataset Year</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-error-radios"
                        name="quiz"
                        value={value}
                        onChange={handleRadioChange}
                    >
                        {/* <FormControlLabel value="2019" control={<Radio />} label="2019 DataSet" />
            <FormControlLabel value="2020" control={<Radio />} label="2020 DataSet" />
            <FormControlLabel value="2021" control={<Radio />} label="2021 DataSet" /> */}
                        <FormControlLabel value="2022" control={<Radio />} label="2022 DataSet" />
                    </RadioGroup>
                    <FormHelperText>{helperText}</FormHelperText>
                    <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                        View Set
                    </Button>
                </FormControl>
            </form>

        </>
    );
}
