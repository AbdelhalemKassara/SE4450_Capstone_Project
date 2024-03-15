import { useContext, useState} from "react";
import { DatabaseContext } from "../../components/DatabaseContext"; 
import { Chart } from 'react-google-charts';
import * as React from 'react'

export default function Export() {

  const database = useContext(DatabaseContext);

  const [data, setData] = useState([
    ['Household', 5000],
    ['Cosmetics', 3100]
    
]);

/* function selectedValue() {
    
}

function handleDataUpdate() {
    const newData = data.map((entry, index) => {
        if (index === 0) {
            return entry;
        } else {
            const newProfit = selectedValue();
            return [entry[0], newProfit];
        }
    });
    setData(newData);
}
*/

return  (
    <div className='py-10 flex flex-col items-center justify-center'>
        <Chart
            width={'100%'}
            chartType='PieChart'
            data={data}
        />
    </div>
)

}