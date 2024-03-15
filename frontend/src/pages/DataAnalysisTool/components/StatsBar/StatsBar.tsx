import styles from './styles.module.css'

import { useContext, useEffect, useState } from "react";
import {  datasetQuery } from "../../../../components/DatabaseContext";
import * as React from 'react';


export default function StatsBar({ dataset, depVar }: { dataset: string | undefined,depVar: string | undefined }): JSX.Element {
  const datasetQ = useContext(datasetQuery);

  const [totalResp, setTotalResp] = useState<number | undefined>();

  useEffect(() => {
    if(dataset && depVar) {
      datasetQ.getTotalResponses(dataset, depVar).then(val => {
        setTotalResp(val);

      });
    }
  }, [dataset, depVar]);

  return (
    <div className={styles.text}>
      <p>Total Responses: {totalResp}</p>
    </div>
  )
}
