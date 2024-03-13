import { FileFetcherTest } from "../../components/DatabaseContext";
import { useContext, useEffect } from "react";

export default function TestPageDeleteThis(): JSX.Element {
  const fileFetcher = useContext(FileFetcherTest);

  useEffect(() => {
    (async () => {

      // console.log(await fileFetcher.getDatasetsIds());
      // console.log(await fileFetcher.getIndependentVarsIds("2020"));
      // console.log(await fileFetcher.getDependentVarsIds("2020"));
      // console.log(await fileFetcher.getAllVarIds("2020"));
      // console.log(await fileFetcher.getColVals("2020", "dc20_citizenship"));


    })()

  }, []);
  return (<>
  </>);
}
