import { useContext, useEffect } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";

export default function DataAnalysisTool() {
  const database = useContext(DatabaseContext);

  useEffect(() => {
    // let test = new csvQuery();

    setTimeout(() => {
      console.log(database.getDatasetsNames());
      console.log(database.getIndependentQuestions("2022-dataset.json"));
      console.log(database.getDependentQuestions("2022-dataset.json"));
      // console.log(database.getQuestions("2022-dataset.json"))
    }, 1000)
  }, []);


  return (<>
    <p>test</p>
  </>)
}

