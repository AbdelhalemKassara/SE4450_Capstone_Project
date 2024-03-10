import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";
import DropdownMenu from "../CdemPage/DependentSelection/DropdownMenu";
import SelectionTool from "../SelectionTool/selectionTool";
import StatsBar from "./components/StatsBar/StatsBar";
import IndVarDropDown from "./components/IndVarDropDown/IndVarDropDown";
import CdemHeader from "../HomePage/Header/CdemHeader";
import CDemFooter from "../HomePage/Footer/CdemFooter";

import "./index.scss";


export default function DataAnalysisTool(): JSX.Element {
  const database = useContext(DatabaseContext);
  const [dataset, setDataset] = useState<string>("2022-dataset.json"); //this(the hardcoding a valid dataset) is a janky fix for the IndVarDropDown where fetchting independent variables without a valid dataset throws an error
  const [depVar, setDepVar] = useState<string>("dc22_democratic_sat"); //dependent variable
  const [indVar, setIndVar] = useState<string>("dc22_age_in_years"); //demographic variable

  // Inside your component function
const [selectedButton, setSelectedButton] = useState<string>("");

  //these are used for the temporary display output (might not )
  const [indVarAnswrCnt, setIndVarAnswrCnt] = useState([]);
  const [depVarAnswrCnt, setDepVarAnswrCnt] = useState([]);
  useEffect(() => {
    console.log("current independent variable", indVar);
  }, [indVar]);
  useEffect(() => {
    // let test = new csvQuery();

    (async () => {
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
    })();
  }, []);

  useEffect(() => {
    console.log("Dataset, DepVar, IndVar, SelectedButton:", dataset, depVar, indVar, selectedButton);
    database.getAnswersCount(dataset, indVar).then((val) => {
      console.log("IndVarAnswrCnt after getAnswersCount:", val);
      setIndVarAnswrCnt(val);
    });
  }, [dataset, indVar]);
  

  useEffect(() => {
    console.log("DepVarAnswrCnt before getFilteredAnswersCount:", depVarAnswrCnt);
    database.getFilteredAnswersCount(dataset, depVar, indVar, selectedButton).then((val) => {
      console.log("DepVarAnswrCnt after getFilteredAnswersCount:", val);
      setDepVarAnswrCnt(val);
    });
  }, [dataset, depVar, indVar, selectedButton]);

  function handleButtonClick(value: string) {
    console.log("Button Clicked:", value);
    setSelectedButton(value);
  }

  function test(obj: any, title: any) {
    let out: JSX.Element[] = [];
    for (let [key, value] of Object.entries(obj)) {
      //@ts-ignore
      out.push(
        <p key={key}>
          {key} : {value}
        </p>
      );
    }
  
    return (
      <>
        <p>{title}</p>
        {out}
      </>
    );
  }
  
  function createButtons(obj: any, title: any) {
    let out: JSX.Element[] = [];
    for (let [key, value] of Object.entries(obj)) {
      //@ts-ignore
      out.push(
        <button key={key} onClick={() => handleButtonClick(key)}>
          {key} : {value}
        </button>
      );
    }
  
    return (
      <>
        <p>{title}</p>
        {out}
      </>
    );
  }

  return (
    <div id="data_page">
      <CdemHeader />
      <div className='text'>
        <StatsBar dataset={dataset} depVar={depVar} />
        <IndVarDropDown
          indVar={indVar}
          setIndVar={setIndVar}
          dataset={dataset}
        />
        {createButtons(indVarAnswrCnt, "Select a filter: ")}
        <SelectionTool dataset={dataset} setDataset={setDataset} />
        <br/>
        <br/>
        <DropdownMenu
          dataset={dataset}
          setDependentQuestion={setDepVar}
          depVar={depVar}
        />
        {test(depVarAnswrCnt, "Depenent Variables Answer count")}
      </div>
      <CDemFooter />
    </div>
  );
}