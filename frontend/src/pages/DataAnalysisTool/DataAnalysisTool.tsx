import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";
import DropdownMenu from "../../components/DropdownMenu";
import SelectionTool from "../../pages/SelectionTool/selectionTool";

export default function DataAnalysisTool() {
  const database = useContext(DatabaseContext);
  const [dataset, setDataset] = useState<string>("");



  return (<>
    <SelectionTool dataset={dataset} setDataset={setDataset}/>
    <DropdownMenu dataset={dataset} setDependentQuestion={setDataset}/>
  </>)
}

