import { FileFetcherTest, datasetQuery, DatabaseContext } from "../../components/DatabaseContext";
import { useContext, useEffect } from "react";

export default function TestPageDeleteThis(): JSX.Element {
  const fileFetcher = useContext(FileFetcherTest);
  const database = useContext(DatabaseContext);
  
  const dataset = useContext(datasetQuery);

  useEffect(() => {
    (async () => {

      //fileFetcher
      // console.log(await fileFetcher.getDatasetsIds());
      // console.log(await fileFetcher.getIndependentVarsIds("2020"));
      // console.log(await fileFetcher.getDependentVarsIds("2020"));
      // console.log(await fileFetcher.getAllVarIds("2020"));
      // console.log(await fileFetcher.getColVals("2020", "dc20_citizenship"));
      console.log(await fileFetcher.getQuestionText("2022", "dc22_citizenship"));
      console.log(await fileFetcher.getType("2022", "dc22_citizenship"));

      //issue with choice order not getting remapped for whatever reason on this one
      // console.log(await fileFetcher.getColsVals("2020" , "dc20_citizenship"));
      // console.log(await fileFetcher.getColsVals("2022" , "dc22_citizenship"));


      //old csvQuery (All of these need a function in DatasetQuery)
      // console.log(await database.getDatasetsNames());
      // console.log(await database.getIndependentQuestions("2022-dataset.json"));
      // console.log(await database.getDependentQuestions("2022-dataset.json"));
      // console.log(await database.getQuestions("2022-dataset.json"));
      // console.log("dc22_age_in_years", await database.getAnswers("2022-dataset.json", "dc22_age_in_years"));
      // console.log()
      // console.log("dc22_age_in_years", await database.getAnswersCount("2022-dataset.json", "dc22_age_in_years"), await database.getAnswers("2022-dataset.json", "dc22_age_in_years"));
      // console.log("dc22_provvote", await database.getAnswersCount("2022-dataset.json", "dc22_provvote"), await database.getAnswers("2022-dataset.json", "dc22_provvote"));
      // console.log(await database.getAnswersCount("2022-dataset.json", "dc22_age_in_years"));
      // console.log(await database.getAnswerCount("2022-dataset.json", "dc22_age_in_years", "12"));
      // console.log(await database.getTotalResponses("2022-dataset.json", "dc22_age_in_years"));


      //datasetQuery

    })();

  }, []);
  return (<>
  </>);
}
