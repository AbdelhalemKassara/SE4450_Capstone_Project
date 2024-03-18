import { useContext, useEffect, useState } from "react";
import { datasetQuery } from '../../../components/DatabaseContext';

interface FilterButtonsProps {
  dataset: string | undefined;
  indVar: string | undefined;
  setSelectedButton: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

export default function FilterButtons({ dataset, indVar, setSelectedButton }: FilterButtonsProps): JSX.Element {
  const datasetQ = useContext(datasetQuery);

  const [indVarAnswrCnt, setIndVarAnswrCnt] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (dataset && indVar) {
      datasetQ.getAnswersCount(dataset, indVar).then((val: Map<string, number>) => {
        const initialMap: Map<string, boolean> = new Map();

        val.forEach((_, key) => {
          initialMap.set(key, false);
        });
        setIndVarAnswrCnt(initialMap);
      });
    } else {
      setIndVarAnswrCnt(new Map());
    }
  }, [dataset, indVar]);

 const handleButtonClick = (key: string) => {
let ref;
    setIndVarAnswrCnt((prevState) => {
      const newState = new Map(prevState);
      newState.set(key, !prevState.get(key));
      //console.log(newState);
ref = newState;     
return newState;
    });

    // Update selected filters based on the new state directly
    const updatedArray = Array.from(ref)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => key);

    // console.log("Updated Array:", updatedArray);

    setSelectedButton(updatedArray);
  };

  return (
    <>
      <p>Select filter(s):</p>
      <div className="data_filter_buttons">
        {Array.from(indVarAnswrCnt).map(([key, isSelected]) => (
          <button
            key={key}
            onClick={() => handleButtonClick(key)}
            style={{ backgroundColor: isSelected ? 'gray' : '#fbc02d' }}
          >
            {key}
          </button>
        ))}
      </div>
    </>
  );
}
