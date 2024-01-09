import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../components/DatabaseContext";
import DropdownMenu from "../../components/DropdownMenu";

export default function DataAnalysisTool() {
  const database = useContext(DatabaseContext);
  const [dataset, setDataset] = useState<string>("");



  return (<>
    <SelectionTool dataset={dataset} setdataset={setDataset}/>
    <DropdownMenu dataset={dataset}/>
  </>)
}

