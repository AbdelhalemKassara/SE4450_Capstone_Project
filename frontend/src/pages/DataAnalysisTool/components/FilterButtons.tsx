
export default function FilterButtons({indVarAnswrCnt, setSelectedButton}: {indVarAnswrCnt: Map<string, number> | undefined, setSelectedButton: React.Dispatch<React.SetStateAction<string | undefined>>,}): JSX.Element {

  if(indVarAnswrCnt) {
    return (<>
      <p>Select a filter: </p>
      {(() => {
        let out: JSX.Element[] = [];
        for (let [key] of indVarAnswrCnt) {
          out.push(
            <button key={key} onClick={() => {setSelectedButton(key)}} >
              {key}
            </button>
          );
        }
    
        return out;
      })()}
      </>)
  } else {
    return <></>;
  }

}



