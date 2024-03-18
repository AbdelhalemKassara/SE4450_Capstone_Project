import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatabaseContext, datasetQuery } from '../../../../components/DatabaseContext';
import { useContext, useState, useEffect, useRef } from 'react';
import { QuestionId, QuestionText } from '../../../../components/NewTypes';

export default function IndVarDropDown({ setIndVar, indVar, dataset, depVar }:
  { setIndVar: React.Dispatch<React.SetStateAction<string | undefined>>, indVar: string | undefined, dataset: string | undefined, depVar: (string | undefined) }): JSX.Element {

  const datasetQ = useContext(datasetQuery);
  const elementRef = useRef(null);
  const [indVars, setIndVars] = useState<Map<QuestionId, QuestionText>>();

  useEffect(() => {

    if (dataset) {
      datasetQ.getIndependentQuestions(dataset).then((val: Map<QuestionId, QuestionText>) => {
        setIndVars(val);
      })
    } else {
      setIndVars(new Map());
      setIndVar(undefined);
    }
  }, [dataset]);


  return (
    <FormControl fullWidth ref={elementRef}>
      <InputLabel id="demo-simple-select-label">Independent Variables</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={indVar ? indVar : ''}
        label="Independent Variables"
        onChange={(event: SelectChangeEvent) => {
          setIndVar(event.target.value);
        }}
      >
        {(() => {
          let out: JSX.Element[] = [];
          indVars?.forEach((value, key) => {
            const currWidth = elementRef?.current?.offsetWidth || 0
            out.push(
              <MenuItem key={key} value={key}>
                <span style={{ width: currWidth === 0 ? '100%' : `${currWidth}px`, whiteSpace: 'wrap' }}>
                  {value}
                </span>
              </MenuItem>)
          })
          return out;
        })()}

      </Select>
    </FormControl>
  )
}
