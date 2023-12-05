import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";
import Button from "@mui/material/Button";

import CdemHeader from "../HomePage/Header/CdemHeader";
import SelectionTool from "../SelectionTool/selectionTool";
import IndependentSelection from "./IndependentSelection/IndependentSelection";
import DropdownMenu from "./DependentSelection/DropdownMenu";
import {
  IndependentQuestions,
  QuestionAnswers,
  Answers,
  IndependentVariableSelection,
} from "./interface";

import "./index.scss";

const CdemPage = () => {
  const [independentQuestions, setIndependentQuestions] = useState<
    IndependentQuestions[]
  >([]);
  const [answerKey, setAnswerKey] = useState<QuestionAnswers>({});
  const [displayYearDummy, setDisplayYearDummy] = useState<string>('');
  const [inputSelections, setInputSelections] =
    useState<IndependentVariableSelection>({
      dc22_age_in_years: "",
      dc22_genderid: "",
      dc22_province: "",
      dc22_education: "",
      dc22_canada_born: "",
    });
  const database = useContext(DatabaseContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const questionsData = await database.getIndependentQuestions(
          "2022-dataset.json"
        );
        setIndependentQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchData();
  }, [database]);

  useEffect(() => {
    async function fetchAnswers() {
      const questionAnswers: QuestionAnswers = {};
      const independentKeys = independentQuestions.slice(1);

      try {
        for (const question of independentKeys) {
          const questionsData = await database.getAnswers(
            "2022-dataset.json",
            question?.key
          );
          questionAnswers[question?.key as keyof QuestionAnswers] =
            Object.values(questionsData).map((answers: Answers) => {
              return answers?.Display;
            });
        }
        setAnswerKey(questionAnswers);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchAnswers();
  }, [independentQuestions, database]);

  useEffect(() => {
    async function fetchData() {
      try {
        const questionsData = await database.getAnswersCount(
          "2022-dataset.json",
          "dc22_age_in_years"
        );
        setDisplayYearDummy(questionsData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchData();
  }, [database]);

  const handleSubmit = async () => {
    try {
      const questionsData = await database.getAnswerCount(
        "2022-dataset.json",
        "dc22_age_in_years",
        inputSelections?.dc22_age_in_years
      );
      setDisplayYearDummy(questionsData.toString());
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <div id="cdem_page">
      <CdemHeader />
      <div className="cdem_page_body">
        <div className="cdem_selection">
          <SelectionTool />
          <IndependentSelection
            independentQuestions={independentQuestions}
            answerKey={answerKey}
            inputSelections={inputSelections}
            handleInputSelections={setInputSelections}
          />
          <DropdownMenu />
        </div>
        <div>
          <Button variant="outlined" onClick={handleSubmit}>
            Primary
          </Button>
        </div>
        <div className="answer">Total: {typeof displayYearDummy === 'string' ? displayYearDummy : 0}</div>
      </div>
    </div>
  );
};

export default CdemPage;
