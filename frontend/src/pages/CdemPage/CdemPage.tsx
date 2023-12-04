import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";

import CdemHeader from "../HomePage/Header/CdemHeader";
import IndependentSelection from "./IndependentSelection/IndependentSelection";
import { IndependentQuestions, QuestionAnswers, Answers } from "./interface";

import "./index.scss";

const CdemPage = () => {
  const [independentQuestions, setIndependentQuestions] = useState<
    IndependentQuestions[]
  >([]);
  const [answerKey, setAnswerKey] = useState<QuestionAnswers>({});
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

  return (
    <div id="cdem_page">
      <CdemHeader />
      <div className="cdem_page_body">
        <IndependentSelection
          independentQuestions={independentQuestions}
          answerKey={answerKey}
        />
      </div>
    </div>
  );
};

export default CdemPage;
