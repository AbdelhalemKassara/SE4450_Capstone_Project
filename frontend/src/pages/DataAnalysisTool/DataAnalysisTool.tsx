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

export default function DataAnalysisTool(): JSX.Element {
  const database = useContext(DatabaseContext);
<<<<<<< HEAD
  const datasetQ = useContext(datasetQuery);

  const [dataset, setDataset] = useState<String>(); //this(the hardcoding a valid dataset) is a janky fix for the IndVarDropDown where fetchting independent variables without a valid dataset throws an error
  const [depVar, setDepVar] = useState<String>(); //dependent variable
  const [indVar, setIndVar] = useState<String>(); //demographic variable
=======
  const [dataset, setDataset] = useState<string>("2020-dataset.json"); //this(the hardcoding a valid dataset) is a janky fix for the IndVarDropDown where fetchting independent variables without a valid dataset throws an error
  const [depVar, setDepVar] = useState<string>("dc20_pos_career_pol"); //dependent variable
  const [indVar, setIndVar] = useState<string>("dc20_consent"); //demographic variable
  const [mapData, setMapData] = useState({ province: {}, riding: [] })
>>>>>>> 1dbd168 (Update csv query)

  const [data, setData] = useState(false);
  const [mapType, setMapType] = useState<string>('province');

  // Inside your component function
  const [selectedButton, setSelectedButton] = useState<string>("");

  //chart colours
  const chartColors = ['#ffd700', '#ffc700', '#ffb700', '#ffa700', '#ff9700'];
  //these are used for the temporary display output (might not )
  const [indVarAnswrCnt, setIndVarAnswrCnt] = useState([]);
  const [depVarAnswrCnt, setDepVarAnswrCnt] = useState([]);
  useEffect(() => {
    console.log("current independent variable", indVar);
  }, [indVar]);
  

  useEffect(() => {
    console.log("Dataset, DepVar, IndVar, SelectedButton:", dataset, depVar, indVar, selectedButton);
    database.getAnswersCount(dataset, indVar).then((val) => {
      console.log("IndVarAnswrCnt after getAnswersCount:", val);
      setIndVarAnswrCnt(val);

    });
  }, [dataset, indVar]);




  useEffect(() => {
    console.log("DepVarAnswrCnt before getFilteredAnswersCount:", depVarAnswrCnt);
    database.getFilteredAnswersCount(dataset, depVar, indVar, selectedButton).then((val) => {
      console.log("DepVarAnswrCnt after getFilteredAnswersCount:", val);
      if (val?.out) {
        setDepVarAnswrCnt(val.out);
        setMapData({ province: val.province, riding: val.riding });
      }


    });
  }, [depVar, indVar, selectedButton]);

  useEffect(() => {
    const dummyData = [['Category', 'Profit']];
    Object.entries(depVarAnswrCnt).forEach(([key, value]) => {
      // Append the value next to the label
      dummyData.push([`${key} (${value})`, value]);
    });
    setData(dummyData);
  }, [depVarAnswrCnt]);

  useEffect(() => {
    const barData = [['Category', 'Count']];
    Object.entries(depVarAnswrCnt).forEach(([key, value]) => {
      // Append the value next to the label
      barData.push([`${key} (${value})`, value]);
    });
    setData(barData);
  }, [depVarAnswrCnt]);



  function handleButtonClick(value: string) {
    console.log("Button Clicked:", value);
    setSelectedButton(value);

  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapType((event.target as HTMLInputElement).value);
  };


  function Export() {

    const exportitem = document.getElementById('my-table') as HTMLElement;
    html2canvas(exportitem, {}).then(canvas => {

      const imgData = canvas.toDataURL('image/png');
      console.log(imgData);

      const pdf = new jsPDF("p", "mm", "a4");

      const PageHeight = 298;
      const PageWidth = 210;

      const height = canvas.height * PageHeight / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, PageWidth, height);


      pdf.save("data.pdf");
    })
  }


  function createButtons(obj: any, title: any) {
    let out: JSX.Element[] = [];
    for (let [key, value] of Object.entries(obj)) {
      //@ts-ignore


      out.push(
        <button key={key} onClick={() => handleButtonClick(key)} >
          {key}
        </button>
      );
    }

    return (
      <>
        <p>{title}</p>
        {out}
      </>
    );
  }

  return (
    <div id="data_page">
      <CdemHeader />
      <div className='text'>
        <div className="container">
          <SelectionTool dataset={dataset} setDataset={setDataset} />
          <IndVarDropDown indVar={indVar} setIndVar={setIndVar} dataset={dataset} />
          {createButtons(indVarAnswrCnt, "Select a filter: ")}
          <DropdownMenu dataset={dataset} setDependentQuestion={setDepVar} depVar={depVar} />
        </div>
        <StatsBar dataset={dataset} depVar={depVar} />
        <button
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus: ring-blue-300 font-medium'
          onClick={Export}>
          Export PDF
        </button>
        <div id='my-table'>
          <Chart width={'100%'} chartType='BarChart' data={data}
            options={{
              colors: chartColors,
              legend: { position: 'top' }
            }}

          />
          <Chart width={'100%'} chartType='PieChart' data={data}
            options={{
              colors: chartColors,
              legend: { position: 'top' }
            }}
          />
        </div>
        <div id='data_map_component'>
          <div>
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
          <MapComponent mapData={mapData} mapType={mapType} />
        </div>

      </div>
      {< CDemFooter />}
    </div>
  );
}