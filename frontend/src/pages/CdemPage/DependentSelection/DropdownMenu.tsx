import { useContext, useEffect, useState } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { DatabaseContext } from "../../../components/DatabaseContext";

function DropdownMenu({ dataset }: { dataset: string }) {
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
  }, [database]);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedQuestion(event.target.value);
  };

  return (
    <Select value={selectedQuestion} onChange={handleSelectChange}>
      {questions.map((question, index) => (
        <MenuItem key={index} value={question.key}>
          {question.value}
        </MenuItem>
      ))}
    </Select>
  );
}

export default DropdownMenu;

