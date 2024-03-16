import { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';
import { datasetQuery } from "../../../components/DatabaseContext";
import { QuestionId, QuestionText } from '../../../components/NewTypes';

function DropdownMenu({ dataset, setDependentQuestion, depVar }: { dataset: string | undefined, setDependentQuestion: React.Dispatch<React.SetStateAction<string | undefined>>, depVar: string | undefined }): JSX.Element {
  const [questions, setQuestions] = useState<Map<QuestionId, QuestionText>>();
  const datasetQ = useContext(datasetQuery);

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
    setDependentQuestion(event.target.value);
  };


  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Dependant Variables</InputLabel>
      <Select value={depVar ? depVar : ''} onChange={handleSelectChange}>
        {(
          () => {
            let out: JSX.Element[] = [];
            if (questions) {
              for (let [key, value] of questions) {
                out.push(<MenuItem key={key} value={key}>{value}</MenuItem>);
              }
            }
            return out;
          })()}
      </Select>
    </FormControl>

  );
}

export default DropdownMenu;

