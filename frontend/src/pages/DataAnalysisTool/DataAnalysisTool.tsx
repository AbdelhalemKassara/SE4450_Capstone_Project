import { useContext, useEffect, useState } from "react";
import { DatabaseContext, datasetQuery } from "../../components/DatabaseContext";
import DropdownMenu from "../CdemPage/DependentSelection/DropdownMenu";
import SelectionTool from "../SelectionTool/selectionTool";
import StatsBar from "./components/StatsBar/StatsBar";
import IndVarDropDown from "./components/IndVarDropDown/IndVarDropDown";
import CdemHeader from "../HomePage/Header/CdemHeader";
import CDemFooter from "../HomePage/Footer/CdemFooter";
import { Chart } from 'react-google-charts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import MapComponent from "../MapComponent/MapComponent";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import "./index.scss";
import FilterButtons from "./components/FilterButtons";
import { FilteredMapData } from "@components/NewTypes";

export default function DataAnalysisTool(): JSX.Element {
  const datasetQ = useContext(datasetQuery);

  const [dataset, setDataset] = useState<string | undefined>(); //this(the hardcoding a valid dataset) is a janky fix for the IndVarDropDown where fetchting independent variables without a valid dataset throws an error
  const [depVar, setDepVar] = useState<string | undefined>(); //dependent variable
  const [indVar, setIndVar] = useState<string | undefined>(); //demographic variable
  const [mapType, setMapType] = useState<string>('province');
  const [mapData, setMapData] = useState<FilteredMapData>({ province: {}, riding: {} })
  const [data, setData] = useState<undefined | [[string, string], ...Array<[string, number]>]>();
  // Inside your component function
  const [selectedButton, setSelectedButton] = useState<string | undefined>();

  //chart colours
  const chartColors = ['#ffd700', '#ffc700', '#ffb700', '#ffa700', '#ff9700'];
  //these are used for the temporary display output (might not )


  // useEffect(() => {
  //   if (dataset && depVar && selectedButton && indVar) {
  //     datasetQ.getFilteredAnswersCount(dataset, depVar, selectedButton, indVar).then((val: Map<string, number>) => {
  //       const barData: [string, number | string][] = [['Category', 'Count']];
  //       val?.forEach((value, key) => {
  //         barData.push([`${key} (${value})`, value]);
  //       });

  //       setData(barData);
  //     });
  //     datasetQ.getFilteredMapData(dataset, depVar, selectedButton, indVar).then((val: FilteredMapData) => {
  //       setMapData(val);
  //     });
  //   }
  // }, [dataset, depVar, indVar, selectedButton]);

  useEffect(() => {
    if (dataset && depVar && selectedButton && indVar) {
<<<<<<< HEAD
      datasetQ.getFilteredAnswersCount(dataset, depVar, selectedButton, indVar).then((val: Map<string, number>) => {
        const barData: [[string, string], ...Array<[string, number]>] = [['Category', 'Count']];
        val?.forEach((value, key) => {
          barData.push([`${key} (${value})`, value]);
=======
      (async () => {
        let val: Map<string, number> = await datasetQ.getFilteredAnswersCount(dataset, depVar, selectedButton, indVar);
        let answerIds: Map<string, number> = await datasetQ.getAnswerIds(dataset, depVar);
        const reorderedData: [string, number | string][] = [['Category', 'Count']];

        // Iterate over the answer IDs map and use them to reorder the data
        answerIds.forEach((answerId: number, answerText: string) => {
          const count = val.get(answerText) || 0; // Get the count for the current answer
          reorderedData.push([`${answerText} (${count})`, count]);
>>>>>>> 3682c14 (created new mapping for charts)
        });

        console.log(reorderedData);
        setData(reorderedData);
      })()
      datasetQ.getFilteredMapData(dataset, depVar, selectedButton, indVar).then((val: FilteredMapData) => {
        setMapData(val);
      });
    }
  }, [dataset, depVar, indVar, selectedButton]);
  // if (dataset && depVar && selectedButton && indVar) {
  //   datasetQ.getFilteredAnswersCount(dataset, depVar, selectedButton, indVar).then((val: Map<string, number>) => {

  //     datasetQ.getAnswerIds(dataset, depVar).then((answerIds: Map<string, number>) => {
  //       // Create an array to hold the reordered data
  //       const reorderedData: [string, number | string][] = [];

  //       // Iterate over the answer IDs map and use them to reorder the data
  //       answerIds.forEach((answerId: number, answerText: string) => {
  //         const count = val.get(answerText) || 0; // Get the count for the current answer
  //         reorderedData.push([`${answerText} (${count})`, count]);
  //       });

  //       // Set the reordered data
  //       console.log(reorderedData);
  //       setData(reorderedData);
  //     });
  //   });
  // }




  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapType((event.target as HTMLInputElement).value);
  };

  function Export() {

    const exportitem = document.getElementById('my-table') as HTMLElement;
    html2canvas(exportitem, {}).then(canvas => {

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF("p", "mm", "a4");

      const PageHeight = 298;
      const PageWidth = 210;

      const height = canvas.height * PageHeight / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, PageWidth, height);


      pdf.save("data.pdf");
    })
  }


  return (
    <div id="data_page">
      <CdemHeader />
      <div className='analysis_container'>
        <div className="filter_container">
          <SelectionTool dataset={dataset} setDataset={setDataset} setDepVar={setDepVar} setIndVar={setIndVar} />
          <IndVarDropDown indVar={indVar} setIndVar={setIndVar} dataset={dataset} depVar={depVar} />

          <FilterButtons dataset={dataset} indVar={indVar} setSelectedButton={setSelectedButton} />

          <DropdownMenu dataset={dataset} setDependentQuestion={setDepVar} depVar={depVar} />
          <button
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus: ring-blue-300 font-medium'
            onClick={Export}>
            Export PDF
          </button>
          <FormControl>
            <FormLabel id="map-control-group">Map Type</FormLabel>
            <RadioGroup
              aria-labelledby="map-control-group"
              name="cmap-control-group"
              value={mapType}
              onChange={handleChange}
            >
              <FormControlLabel value="province" control={<Radio />} label="Province" />
              <FormControlLabel value="riding" control={<Radio />} label="Riding" />
            </RadioGroup>
          </FormControl>
        </div>
        <div className='data_container'>
          <StatsBar dataset={dataset} depVar={depVar} />

          <div id='data_map_component'>
            <MapComponent mapData={mapData} mapType={mapType} />
          </div>

          <div id='my-table'>
            <Chart width={'100%'} chartType='PieChart' data={data}
              options={{
                colors: chartColors,

              }}

            />
            <Chart chartType='BarChart' data={data}
              options={{
                colors: chartColors,
                chartArea: { width: '80%', height: '70%' }, // Adjust the chart area to ensure labels fit.
                hAxis: {
                  textStyle: {
                    fontSize: 10 // Adjust the horizontal axis label font size
                  }
                },
                vAxis: {
                  textStyle: {
                    fontSize: 8 // Adjust the vertical axis label font size
                  }
                },
                bar: { groupWidth: '75%' }, // Adjust the bar width for better label visibility
                legend: { position: 'none' }, // Adjust legend position or remove if not needed

              }}

            />
          </div>

        </div>
      </div>
      {< CDemFooter />}
    </div >
  );
}