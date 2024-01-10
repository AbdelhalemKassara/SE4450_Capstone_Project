import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatabaseContext } from '../../../../components/DatabaseContext';
import { useContext, useState, useEffect } from 'react';

export default function IndVarDropDown({setIndVar, indVar, dataset}: 
  {setIndVar: React.Dispatch<React.SetStateAction<string>>, indVar: string, dataset: string}): JSX.Element{
  
  const database = useContext(DatabaseContext);
  const [indVars, setIndVars] = useState<{key : string, value : any}[]>([]);

  useEffect(() => {
    database.getIndependentQuestions(dataset).then((val: {key : string, value : any}[]) => {
      setIndVars(val);
    });
  }, []);


  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={indVar}
        label="Independent Variables"
        onChange={(event: SelectChangeEvent) => {
          setIndVar(event.target.value);
        }}
      >
        {(() => {
            let out: JSX.Element[] = [];
            indVars.forEach(({key, value}) => {
              out.push(<MenuItem id={key} value={key}>{value}</MenuItem>)
            })
            return out;
        })()}
       
      </Select>
    </FormControl>  
  )
}
