import { useContext, useEffect, useState } from "react";
import { DatabaseContext, datasetQuery } from "../../components/DatabaseContext";
import DropdownMenu from "./DependentSelection/DropdownMenu";
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
  //const [mapData, setMapData] = useState({ province: {}, riding: [] })
  const [answerIds, setAnswerIds] = useState<Map<string, number>>(new Map());
  const [multipliedValues, setMultipliedValues] = useState(new Map());
  const [averageValue, setAverageValue] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [median, setMedian] = useState<number>(0);
  const [standardDeviation, setStandardDeviation] = useState<number>(0);
  const [selectedRiding, setSelectedRiding] = useState<number>(0);

  const [mapData, setMapData] = useState<FilteredMapData>({ province: {}, riding: {} })
  const [data, setData] = useState<undefined | [string, number | string][]>();

  // Inside your component function
  const [selectedButton, setSelectedButton] = useState<string[] | undefined>();
  const [chartType, setChartType] = useState<string>();
  //for columnChart
  const [columnChartType, setColumnChartType] = useState<string[][]>(); // Initialize with default chart type
  //chart colours
  const chartColors = ['#ffd700', '#ffc700', '#ffb700', '#ffa700', '#ff9700'];

  // Declared filters and chart data
  const [filter1, setFilter1] = useState<string | undefined>();
  const [filter2, setFilter2] = useState<string | undefined>();
  const [chartData, setChartData] = useState<string>(''); // Initialize with empty array for chart data
  const [secondChartData, setSecondChartData] = useState<string[][]>('');

  useEffect(() => {
    const fetchFilter1Data = async () => {
      if (!dataset || !depVar || !selectedButton || !indVar) {
        return;
      }

      const chartData = [['Category']]; // Initialize with header row
      let depQuestAnsw = await datasetQ.getAnswers(dataset, depVar);

      // Set the question answers
      depQuestAnsw.forEach((questionTxt: string) => {
        chartData.push([questionTxt]);
      });

      // Load the counts for each filter
      selectedButton.forEach(async (filter: string, i) => {
        let filterData = await datasetQ.getFilteredAnswersCount(dataset, depVar, filter, indVar);
        chartData[0].push(filter);

        for (let i = 1; i < chartData.length; i++) {
          let test = filterData.get(chartData[i][0]);
          if (test) {
            //@ts-ignore
            chartData[i].push(test);
          } else {
            // @ts-ignore
            chartData[i].push(0);
          }
        }

        // Set the chart data state only if the number of filters is less than or equal to 4
        if (selectedButton.length <= 4) {
          setChartData(chartData);
        } else if (i === 3) {
          // If there are more than 4 filters and this is the fourth filter, set the chart data for the second chart
          setSecondChartData(chartData);
        }
      });
    };

    fetchFilter1Data();
  }, [columnChartType, filter1, filter2, dataset, depVar, indVar, selectedRiding, selectedButton]);





  //filters
  // Function to handle filter changes
  const handleFilterChange = (filterNumber: number, value: string) => {
    if (filterNumber === 1) {
      setFilter1(value);
    } else if (filterNumber === 2) {
      setFilter2(value);
    }
  };

  useEffect(() => {
    if (dataset && depVar && selectedButton && indVar) {
      (async () => {
        let val: Map<string, number> = await datasetQ.getFilteredAnswersCounts(dataset, depVar, selectedButton, indVar, selectedRiding);
        // console.log("this is the selectedbutton " + selectedButton);
        let answerIds: Map<string, number> = await datasetQ.getAnswerIds(dataset, depVar);
        const reorderedData: [string, number | string][] = [['Category', 'Count']];
        // Iterate over the answer IDs map and use them to reorder the data
        answerIds.forEach((answerId: number, answerText: string) => {
          const count = val.get(answerText) || 0; // Get the count for the current answer
          reorderedData.push([`${answerText} (${count})`, count]);
        });
        setData(reorderedData);
      })()
      datasetQ.getFilteredMapDatas(dataset, depVar, selectedButton, indVar).then((val: FilteredMapData) => {
        setMapData(val);
      });
    }
  }, [dataset, depVar, indVar, selectedButton, selectedRiding]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapType((event.target as HTMLInputElement).value);
    setSelectedRiding(0);
  };

  // const handleChartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChartType((event.target as HTMLInputElement).value);
  // };

  const handleChartChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColumnChartType((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    if (dataset && depVar) {
      const fetchData = async () => {
        try {
          const answerIds = await datasetQ.getAnswerIds(dataset, depVar);

          // Rescale the IDs within the Map
          const rescaledIds = new Map<string, number>();
          const values = Array.from(answerIds.values());
          const rescaledValues = rescaleTo100(values);
          //console.log("hello " + rescaledIds);

          answerIds.forEach((value, key, map) => {
            rescaledIds.set(key, rescaledValues.shift() || 0);
          });

          setAnswerIds(rescaledIds);
        } catch (error) {
          console.error("Error fetching and rescaling answer IDs:", error);
        }
      };
      fetchData();
    }
  }, [dataset, depVar, datasetQ]);

  useEffect(() => {
    if (answerIds && data && answerIds.size > 0 && data.length > 0) {
      const calculatedValues = new Map();
      let totalCount = 0;
      let sumOfMultipliedValues = 0;
      const multipliedValuesArray = []; // Array to store multiplied values for median calculation

      //console.log(answerIds);
      //console.log(data);

      for (const [key, value] of answerIds.entries()) {
        const dataEntry = data.find(([text]) => {
          const [category] = text.split(' (');
          return category === key;
        });

        if (dataEntry) {
          //console.log(dataEntry);
          //console.log(value);
          const numericValue = Number(dataEntry[1]);
          //console.log(numericValue);
          for (let i = 0; i < numericValue; i++) {
            multipliedValuesArray.push(value); // Add multiplied value to array
          }
          const multipliedValue = value * numericValue;
          calculatedValues.set(key, multipliedValue);
          totalCount += numericValue;
          sumOfMultipliedValues += multipliedValue;
        }
      }

      const averageValue = totalCount > 0 ? sumOfMultipliedValues / totalCount : 0;

      const sortedMultipliedValues = multipliedValuesArray.sort((a, b) => a - b);
      const median =
        sortedMultipliedValues.length % 2 === 0
          ? (sortedMultipliedValues[sortedMultipliedValues.length / 2 - 1] +
            sortedMultipliedValues[sortedMultipliedValues.length / 2]) /
          2
          : sortedMultipliedValues[Math.floor(sortedMultipliedValues.length / 2)];
      setMedian(median);
      //console.log("this is the median " + median)

      // Calculate standard deviation
      const mean = averageValue;
      const squaredDifferences = multipliedValuesArray.map(value => Math.pow(value - mean, 2));
      const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / multipliedValuesArray.length;
      const stdDeviation = Math.sqrt(variance);
      setStandardDeviation(stdDeviation);
      //console.log("this is the standard deviation " + stdDeviation)

      setTotalCount(totalCount);
      setAverageValue(averageValue);
      setMultipliedValues(calculatedValues);
    }
  }, [answerIds, data]);




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

  function rescaleTo100(sequence: number[]): number[] {
    const min = Math.min(...sequence);
    const max = Math.max(...sequence);
    const range = max - min;
    const scaleFactor = 100 / range;

    const rescaledSequence = sequence.map(num => Math.round((max - num) * scaleFactor));

    return rescaledSequence;
  }

  return (
    <div id="data_page">
      <CdemHeader />
      <div className='analysis_container'>
        <div className="filter_container" onClick={() => { if (mapType === 'riding' && selectedRiding !== 0) { setSelectedRiding(0) } }}>
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
          <FormControl>
            <FormLabel id="column-chart-control-group">Column Chart Type</FormLabel>
            <RadioGroup
              aria-labelledby="column-chart-control-group"
              name="column-chart-control-group"
              value={columnChartType}
              onChange={handleChartChange2}
            >
              {/* Add radio buttons for different column chart types */}
              <FormControlLabel value="ColumnChart" control={<Radio />} label="Column" />
              {/* Add more options as needed */}
            </RadioGroup>
          </FormControl>
          {/* <FormControl>
            <FormLabel id="chart-control-group">Chart Type</FormLabel>
            <RadioGroup
              aria-labelledby="chart-control-group"
              name="chart-control-group"
              value={chartType}
              onChange={handleChartChange}
            >
              <FormControlLabel value="BarChart" control={<Radio />} label="Bar" />
              <FormControlLabel value="PieChart" control={<Radio />} label="Pie" />
              <FormControlLabel value="ColumnChart" control={<Radio />} label="Column" />
            </RadioGroup>
          </FormControl> */}
        </div>
        <div className='data_container'>
          <StatsBar dataset={dataset} depVar={depVar} />
          <div className='data_stats'>
            <div className="statistic-box">
              <p className="statistic-label">Count:</p>
              <p className="statistic-value">{totalCount}</p>
            </div>
            <div className="statistic-box">
              <p className="statistic-label">Mean:</p>
              <p className="statistic-value">{Math.round(averageValue * 100) / 100}</p>
            </div>
            <div className="statistic-box">
              <p className="statistic-label">Median:</p>
              <p className="statistic-value">{median}</p>
            </div>
            <div className="statistic-box">
              <p className="statistic-label">Standard Deviation:</p>
              <p className="statistic-value">{Math.round(standardDeviation * 100) / 100}</p>
            </div>
          </div>
          <div id='data_map_component'>
            <MapComponent mapData={mapData} mapType={mapType} setSelectedRiding={setSelectedRiding} />
          </div>
          <div id='my-table'>
            <Chart
              width={'100%'}
              chartType={columnChartType} // Use the state variable for dynamic chart type
              data={chartData}
              options={{
                colors: chartColors, // Example chart colors
                chartArea: { width: '80%', height: '70%' }, // Adjust the chart area as needed
                // Other chart options...
              }}
            />
          </div>
          {selectedButton?.length > 4 && secondChartData && (
            <div id='second-chart'>
              <Chart
                width={'100%'}
                chartType={columnChartType} // Use the state variable for dynamic chart type
                data={secondChartData}
                options={{
                  colors: chartColors, // Example chart colors
                  chartArea: { width: '80%', height: '70%' }, // Adjust the chart area as needed
                  // Other chart options...
                }}
              />
            </div>
          )}
          {/* <div id='my-table'>
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
          </div> */}

        </div>
      </div>
      {< CDemFooter />}
    </div >
  );
}