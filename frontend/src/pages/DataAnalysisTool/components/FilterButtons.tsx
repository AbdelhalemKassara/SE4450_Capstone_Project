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
      datasetQ.getAnswersCount(dataset, indVar)
        .then((val: Map<string, number>) => {
          const initialMap: Map<string, boolean> = new Map();
  
          console.log("hit ethan, this is the initial map ", initialMap);
  
          val.forEach((_, key) => {
            initialMap.set(key, false);
          });
  
          // Chain the promise to get answerIds
          return datasetQ.getAnswerIds(dataset, indVar)
            .then((answerIds: Map<string, number>) => {
              // Sort the initial map based on answerIds indexes
              const sortedArray = Array.from(initialMap).sort((a, b) => {
                const indexA = parseInt(answerIds.get(a[0]) || "0");
                const indexB = parseInt(answerIds.get(b[0]) || "0");
                return indexA - indexB;
              });
  
              setIndVarAnswrCnt(new Map(sortedArray));
  
              // You can handle answerIds data here if needed
              console.log("hi ethan, this is the answers ", answerIds);
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIndVarAnswrCnt(new Map()); // Reset to empty map if there's an error
        });
    } else {
      setIndVarAnswrCnt(new Map());
    }
  }, [dataset, indVar, datasetQ]);
  

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
