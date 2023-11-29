import { useContext, useEffect } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";

export default function DataAnalysisTool() {
  const database = useContext(DatabaseContext);

  useEffect(() => {
    // let test = new csvQuery();

      (async () => {
        console.log(await database.getDatasetsNames());
        console.log(await database.getIndependentQuestions("2022-dataset.json"));
        console.log(await database.getDependentQuestions("2022-dataset.json"));
        console.log(await database.getQuestions("2022-dataset.json"));
        console.log(await database.getAnswers("2022-dataset.json", "dc22_age_in_years"));
        console.log(await database.getAnswersCount("2022-dataset.json", "dc22_age_in_years"));
        console.log(await database.getAnswerCount("2022-dataset.json", "dc22_age_in_years", "12"));
        console.log(await database.getTotalResponses("2022-dataset.json", "dc22_age_in_years"));
      })();
  }, []);


  return (<>
    <p>test</p>
  </>)
}

