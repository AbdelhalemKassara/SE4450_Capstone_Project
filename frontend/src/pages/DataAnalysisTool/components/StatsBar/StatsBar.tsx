import styles from './styles.module.css'

import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../../../../components/DatabaseContext";


export default function StatsBar({ dataset, depVar }: { dataset: string,depVar: string }): JSX.Element {
  const database = useContext(DatabaseContext);
  
  const [totalResp, setTotalResp] = useState<number>(0);

  useEffect(() => {
    database.getTotalResponses(dataset, depVar).then(val => {
      setTotalResp(val);
    });

  }, [dataset, depVar]);

  return (
    <div className={styles.text}>
      <p>Total Responses: {totalResp}</p>
    </div>
  )
}
