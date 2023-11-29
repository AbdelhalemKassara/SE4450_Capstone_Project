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
        console.log(await database.getQuestions("2022-dataset.json"))
      })();
  }, []);


  return (<>
    <p>test</p>
  </>)
}

