import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";
import DropdownMenu from "../../components/DropdownMenu";
import SelectionTool from "../SelectionTool/selectionTool";
import StatsBar from "./components/StatsBar/StatsBar";
import styles from "./styles.module.css";

export default function DataAnalysisTool() {
  const database = useContext(DatabaseContext);
  const [dataset, setDataset] = useState<string>("");
  const [depVar, setDepVar] = useState<string>("");
  const [demographicVar, setDemographicVar] = useState<string>("");

  useEffect(() => {
    setDepVar("dc22_democratic_sat");
    setDataset("2022-dataset.json")

  }, []);
  
  useEffect(() => {
    // let test = new csvQuery();

      (async () => {
        // console.log(await database.getDatasetsNames());
        // console.log(await database.getIndependentQuestions("2022-dataset.json"));
        // console.log(await database.getDependentQuestions("2022-dataset.json"));
        // console.log(await database.getQuestions("2022-dataset.json"));
        // console.log(await database.getAnswers("2022-dataset.json", "dc22_age_in_years"));
        console.log(await database.getAnswersCount("2022-dataset.json", "dc22_age_in_years"));
        // console.log(await database.getAnswerCount("2022-dataset.json", "dc22_age_in_years", "12"));
        // console.log(await database.getTotalResponses("2022-dataset.json", "dc22_age_in_years"));
      })();
  }, []);

  return (<>
    <StatsBar dataset={dataset} depVar={depVar} />
    <SelectionTool dataset={dataset} setdataset={setDataset}/>
    <DropdownMenu dataset={dataset}/>
  </>)
}

