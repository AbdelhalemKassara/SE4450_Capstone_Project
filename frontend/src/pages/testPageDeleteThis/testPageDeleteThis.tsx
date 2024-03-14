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
      //console.log(await fileFetcher.getQuestionText("2022", "dc22_citizenship"));
      //console.log(await fileFetcher.getType("2022", "dc22_citizenship"));

      //issue with choice order not getting remapped for whatever reason on this one
      // console.log(await fileFetcher.getColsVals("2020" , "dc20_citizenship"));
      // console.log(await fileFetcher.getColsVals("2022" , "dc22_citizenship"));


      //old csvQuery (All of these need a function in DatasetQuery)
      
      // console.log("Dataset Query0: ", await dataset.getDatasetsNames());
      
      // console.log("Dataset Query1: ", await dataset.getIndependentQuestions("2022"));
      
      // console.log("Dataset Query2:", await dataset.getDependentQuestions("2022"));
      
      // console.log("Dataset Query3:", await dataset.getQuestions("2022"));
      
      // console.log("Dataset Query4:", await dataset.getAnswers("2022", "dc22_provvote"));
      
      // console.log("Dataset Query5:", await dataset.getAnswersCount("2022", "dc22_provvote"));
      // console.log("Dataset Query5(2): ", await dataset.getAnswersCount("2022", "dc22_provvote"), await dataset.getAnswers("2022", "dc22_provvote"));
      // console.log("Dataset Query5(3): ", await dataset.getAnswersCount("2022", "dc22_age_in_years"));
      // console.log("Dataset Query5(4):", await dataset.getAnswersCount("2022", "dc22_age_in_years", "12"));
      
      console.log("Dataset Query6:", await dataset.getTotalResponses("2022", "dc22_provvote"));
    })();

  }, []);
  return (<>
  </>);
}
