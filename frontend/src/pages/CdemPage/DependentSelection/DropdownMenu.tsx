import { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { DatabaseContext } from "../../../components/DatabaseContext";

function DropdownMenu({ dataset, setDependentQuestion, depVar}: { dataset: string, setDependentQuestion: React.Dispatch<React.SetStateAction<string>>, depVar: string}) {
  const [questions, setQuestions] = useState<{ key: string; value: string; }[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const database = useContext(DatabaseContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const questionsData = await database.getDependentQuestions(dataset);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchData();
  }, [database, dataset]);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setDependentQuestion(event.target.value);
  };

  return (
    <Select value={depVar} onChange={handleSelectChange}>
      {questions.map((question, index) => (
        <MenuItem key={index} value={question.key}>
          {question.value}
        </MenuItem>
      ))}
    </Select>
  );
}

export default DropdownMenu;

