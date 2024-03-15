import { useContext, useEffect, useState } from "react";
import { datasetQuery } from '../../../components/DatabaseContext';

export default function FilterButtons({ dataset, indVar, setSelectedButton }: { dataset: string | undefined, indVar: string | undefined, setSelectedButton: React.Dispatch<React.SetStateAction<string | undefined>>, }): JSX.Element {
  const datasetQ = useContext(datasetQuery);

  const [indVarAnswrCnt, setIndVarAnswrCnt] = useState<Map<string, number> | undefined>();

  useEffect(() => {
    if (dataset && indVar) {
      datasetQ.getAnswersCount(dataset, indVar).then((val: Map<string, number>) => {
        setIndVarAnswrCnt(val);
      });
    } else {
      setIndVarAnswrCnt(new Map());
    }

  }, [dataset, indVar]);


  return (<>
    <p>Select a filter: </p>
    <div className='data_filter_buttons'>
      {(() => {
        let out: JSX.Element[] = [];
        if (indVarAnswrCnt) {
          for (let [key] of indVarAnswrCnt) {
            out.push(
              <button key={key} onClick={() => { setSelectedButton(key) }} >
                {key}
              </button>
            );
          }
        }
        return out;
      })()}
    </div>
  </>);
}



