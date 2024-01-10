import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";
import DropdownMenu from "../CdemPage/DependentSelection/DropdownMenu";
import SelectionTool from "../SelectionTool/selectionTool";
import StatsBar from "./components/StatsBar/StatsBar";
import styles from "./styles.module.css";
import IndVarDropDown from "./components/IndVarDropDown/IndVarDropDown";

export default function DataAnalysisTool() {
  const database = useContext(DatabaseContext);
  const [dataset, setDataset] = useState<string>("2022-dataset.json");//this(the hardcoding a valid dataset) is a janky fix for the IndVarDropDown where fetchting independent variables without a valid dataset throws an error 
  const [depVar, setDepVar] = useState<string>(""); //dependent variable
  const [indVar, setIndVar] = useState<string>("");//demographic variable

  useEffect(() => {
    setDepVar("dc22_democratic_sat");
    setDataset("2022-dataset.json")

  }, []);
  
  useEffect(() => {
    // let test = new csvQuery();

      (async () => {
        // console.log(await database.getDatasetsNames());
        console.log(await database.getIndependentQuestions("2022-dataset.json"));
        // console.log(await database.getDependentQuestions("2022-dataset.json"));
        // console.log(await database.getQuestions("2022-dataset.json"));
        // console.log(await database.getAnswers("2022-dataset.json", "dc22_age_in_years"));
        // console.log(await database.getAnswersCount("2022-dataset.json", "dc22_age_in_years"));
        // console.log(await database.getAnswerCount("2022-dataset.json", "dc22_age_in_years", "12"));
        // console.log(await database.getTotalResponses("2022-dataset.json", "dc22_age_in_years"));
      })();
  }, []);

  return (<>
    <StatsBar dataset={dataset} depVar={depVar} />
    <IndVarDropDown indVar={indVar} setIndVar={setIndVar} dataset={dataset} />
    <SelectionTool dataset={dataset} setdataset={setDataset}/>
    <DropdownMenu dataset={dataset}/>
  </>)
}

