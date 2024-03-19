import { useContext, useEffect, useState, useRef } from 'react';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';
import { datasetQuery } from "../../../components/DatabaseContext";
import { QuestionId, QuestionText } from '../../../components/NewTypes';

function DropdownMenu({ dataset, setDependentQuestion, depVar }: { dataset: string | undefined, setDependentQuestion: React.Dispatch<React.SetStateAction<string | undefined>>, depVar: string | undefined }): JSX.Element {
  const [questions, setQuestions] = useState<Map<QuestionId, QuestionText>>();
  const datasetQ = useContext(datasetQuery);
  const elementRef = useRef(null);


  useEffect(() => {
    async function fetchData() {
      if (dataset) {
        const questionsData = await datasetQ.getDependentQuestions(dataset);
        setQuestions(questionsData);
      } else {
        setQuestions(new Map());
        setDependentQuestion(undefined);

      }

    }
    fetchData();
  }, [dataset]);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    console.log(event.target.value);
    setDependentQuestion(event.target.value);
  };

  return (
    <FormControl fullWidth ref={elementRef}>
      <InputLabel id="demo-simple-select-label">Dependant Variables</InputLabel>
      <Select
        value={depVar ? depVar : ''}
        onChange={handleSelectChange}
        fullWidth
        label="Dependant Variables"
      >
        {(
          () => {
            let out: JSX.Element[] = [];
            if (questions) {
              for (let [key, value] of questions) {
                const currWidth = elementRef?.current?.offsetWidth || 0
                out.push(<MenuItem key={key} value={key}>
                  <span style={{ width: currWidth === 0 ? '100%' : `${currWidth}px`, whiteSpace: 'wrap' }}>
                    {value}
                  </span>
                </MenuItem>
                );
              }
            }
            return out;
          })()}
      </Select>
    </FormControl >

  );
}

export default DropdownMenu;

