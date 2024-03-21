import { useContext, useEffect, useState } from "react";
import {
  DatabaseContext,
  datasetQuery,
} from "../../components/DatabaseContext";
import DropdownMenu from "./DependentSelection/DropdownMenu";
import SelectionTool from "../SelectionTool/selectionTool";
import StatsBar from "./components/StatsBar/StatsBar";
import IndVarDropDown from "./components/IndVarDropDown/IndVarDropDown";
import CdemHeader from "../HomePage/Header/CdemHeader";
import CDemFooter from "../HomePage/Footer/CdemFooter";
import { Chart } from "react-google-charts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import MapComponent from "../MapComponent/MapComponent";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import "./index.scss";
import FilterButtons from "./components/FilterButtons";
import { FilteredMapData } from "@components/NewTypes";
import { Key } from "@mui/icons-material";

export default function DataAnalysisTool(): JSX.Element {
  const datasetQ = useContext(datasetQuery);

  const [dataset, setDataset] = useState<string | undefined>(); //this(the hardcoding a valid dataset) is a janky fix for the IndVarDropDown where fetchting independent variables without a valid dataset throws an error
  const [depVar, setDepVar] = useState<string | undefined>(); //dependent variable
  const [indVar, setIndVar] = useState<string | undefined>(); //demographic variable
  const [selectedButton, setSelectedButton] = useState<string[] | undefined>(
    []
  );

  const [answerIds, setAnswerIds] = useState<Map<string, number>>(new Map());
  const [averageValue, setAverageValue] = useState<number>(-1);
  const [totalCount, setTotalCount] = useState<number>(-1);
  const [median, setMedian] = useState<number>(-1);
  const [standardDeviation, setStandardDeviation] = useState<number>(-1);
  const [selectedRiding, setSelectedRiding] = useState<number>(0);

  const [mapData, setMapData] = useState<FilteredMapData>({
    province: {},
    riding: {},
  });
  const [mapType, setMapType] = useState<string>("province");

  const [chartType, setChartType] = useState<string>(); // Inside your component function
  const [columnChartType, setColumnChartType] =
    useState<string[][]>("ColumnChart"); // Initialize with default chart type
  const chartColors = ["#E5E8E8", "#ABB2B9", "#7F8C8D", "#424949", "#212F3D"]; //chart colours

  // Declared filters and chart data
  const [depChartData, setDepChartData] = useState<any[][][]>([]);
  const [data, setData] = useState<undefined | [string, number | string][]>();

  useEffect(() => {
    setDepChartData([]);
    const fetchFilter1Data = async () => {
      if (dataset || depVar) {
        if (selectedButton && indVar) {
          if (selectedButton.length === 0) {
            setDepChartData([]);
            return;
          }
          const chartData = [["Category"]]; // Initialize with header row
          let depQuestAnsw = await datasetQ.getAnswers(dataset, depVar);
          depQuestAnsw.forEach((questionTxt: string) => {
            chartData.push([questionTxt]);
          });
          // Load the counts for each filter
          selectedButton.forEach(async (filter: string) => {
            let filterData = await datasetQ.getFilteredAnswersCount(
              dataset,
              depVar,
              filter,
              indVar,
              selectedRiding
            );
            chartData[0].push(filter);
            for (let i = 1; i < chartData.length; i++) {
              let AnswCountArr = filterData.get(chartData[i][0]);
              if (AnswCountArr) {
                chartData[i].push(AnswCountArr);
              } else {
                chartData[i].push(0);
              }
            }
            let header = chartData[0];

            let body = chartData.slice(1, chartData.length);
            let out = [];

            if (3 < body.length) {
              for (let i = 3; i < body.length; i += 4) {
                //@ts-ignore
                out.push([header, ...body.slice(i - 3, i)]);
              }
            } else {
              out = [[header, ...body]];
            }

            //@ts-ignore
            setDepChartData(out);
          });
        } else {
          const chartData = [["Category", "Count"]]; // Initialize with header row
          const depQuestAnsw = await datasetQ.getAnswers(dataset, depVar);

          // Set the question answers
          depQuestAnsw.forEach((questionTxt: string) => {
            chartData.push([questionTxt]);
          });
          const filterData = await datasetQ.getTotalAnswerCount(
            dataset,
            depVar,
            0
          );
          let c = 1;
          for (const [k, v] of filterData.entries()) {
            if (k) {
              chartData[c].push(v);
              c++;
            } else {
              break;
            }
          }
          setDepChartData(chartData);
        }
      }
    };
    fetchFilter1Data();
  }, [
    columnChartType,
    dataset,
    depVar,
    indVar,
    selectedRiding,
    selectedButton,
  ]);

  useEffect(() => {
    if (dataset && depVar && selectedButton && indVar) {
      (async () => {
        const val: Map<string, number> =
          await datasetQ.getFilteredAnswersCounts(
            dataset,
            depVar,
            selectedButton,
            indVar,
            selectedRiding
          );
        // console.log("this is the selectedbutton " + selectedButton);
        const answerIds: Map<string, number> = await datasetQ.getAnswerIds(
          dataset,
          depVar
        );
        const reorderedData: [string, number | string][] = [
          ["Category", "Count"],
        ];
        // Iterate over the answer IDs map and use them to reorder the data
        answerIds.forEach((answerId: number, answerText: string) => {
          const count = val.get(answerText) || 0; // Get the count for the current answer
          reorderedData.push([`${answerText}`, count]);
        });
        setData(reorderedData);
      })();
      datasetQ
        .getFilteredMapDatas(dataset, depVar, selectedButton, indVar)
        .then((val: FilteredMapData) => {
          setMapData(val);
        });
    } else if (dataset && depVar) {
      (async () => {
        const val: Map<string, number> = await datasetQ.getTotalAnswerCount(
          dataset,
          depVar,
          selectedRiding
        );
        //console.log("this is the selectedbutton " + selectedButton);
        const answerIds: Map<string, number> = await datasetQ.getAnswerIds(
          dataset,
          depVar
        );
        const reorderedData: [string, number | string][] = [
          ["Category", "Count"],
        ];

        // Iterate over the answer IDs map and use them to reorder the data
        answerIds.forEach((answerId: number, answerText: string) => {
          const count = val.get(answerText) || 0; // Get the count for the current answer
          reorderedData.push([`${answerText} (${count})`, count]);
        });

        setData(reorderedData);
      })();
      datasetQ
        .getUnFilteredMapDatas(dataset, depVar)
        .then((val: FilteredMapData) => {
          setMapData(val);
        });
    }
  }, [dataset, depVar, indVar, selectedButton, selectedRiding]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapType((event.target as HTMLInputElement).value);
    setSelectedRiding(0);
  };

  const handleChartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChartType((event.target as HTMLInputElement).value);
  };

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
          const [category] = text.split(" (");
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


      const averageValue =
        totalCount > 0 ? sumOfMultipliedValues / totalCount : 0;

        if(multipliedValuesArray.length > 0){


      const sortedMultipliedValues = multipliedValuesArray.sort(
        (a, b) => a - b
      );
      const median =
        sortedMultipliedValues.length % 2 === 0
          ? (sortedMultipliedValues[sortedMultipliedValues.length / 2 - 1] +
            sortedMultipliedValues[sortedMultipliedValues.length / 2]) /
          2
          : sortedMultipliedValues[
          Math.floor(sortedMultipliedValues.length / 2)
          ];
      setMedian(median);
          }else{
            setMedian(-1);
          }
      //console.log("this is the median " + median)

      if(multipliedValuesArray.length > 0){

      // Calculate standard deviation
      const mean = averageValue;
      const squaredDifferences = multipliedValuesArray.map((value) =>
        Math.pow(value - mean, 2)
      );
      const variance =
        squaredDifferences.reduce((acc, val) => acc + val, 0) /
        multipliedValuesArray.length;
      const stdDeviation = Math.sqrt(variance);
      setStandardDeviation(stdDeviation);

      }else{
        setStandardDeviation(-1);
      }
      //console.log("this is the standard deviation " + stdDeviation)

      setTotalCount(totalCount);
      setAverageValue(averageValue);
    }
  }, [answerIds, data]);

  function Export() {
    const exportitem = document.getElementById("my-table") as HTMLElement;
html2canvas(exportitem, {}).then((canvas) => {
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const PageHeight = 298;
  const PageWidth = 210;

  const height = (canvas.height * PageHeight) / canvas.width;

  let y = 10; // Initial Y coordinate

  if(dataset){
  pdf.text(10, y, `DatasetFile: ${JSON.stringify(dataset)}`);
  y += 10; // Increment Y coordinate
  }

  if(indVar){
  pdf.text(10, y, `independent: ${JSON.stringify(indVar)}`);
  y += 10; // Increment Y coordinate
  }

  if(selectedButton?.length > 0){
  pdf.text(10, y, `filterselected: ${JSON.stringify(selectedButton)}`);
  y += 10; // Increment Y coordinate
  }
  else{
    pdf.text(10, y, `filterselected: all`);
  y += 10;
  }

  if(depVar){
  pdf.text(10, y, `dependent: ${JSON.stringify(depVar)}`);
  y += 10; // Increment Y coordinate
  }

  pdf.text(10, y, `averageValue: ${JSON.stringify(averageValue)} `);
  y += 10; // Increment Y coordinate
  pdf.text(10, y, `totalCount: ${JSON.stringify(totalCount)}`);
  y += 10; // Increment Y coordinate
  pdf.text(10, y, `median: ${JSON.stringify(median)}`);
  y += 10; // Increment Y coordinate
  pdf.text(10, y, `standardDeviation: ${JSON.stringify(standardDeviation)}`);
  y += 10; // Increment Y coordinate

  // Add the image after adding all the text
  pdf.addImage(imgData, "PNG", 0, y, PageWidth, height);

  pdf.save("data.pdf");
});
  }

  function rescaleTo100(sequence: number[]): number[] {
    const min = Math.min(...sequence);
    const max = Math.max(...sequence);
    const range = max - min;
    const scaleFactor = 100 / range;

    const rescaledSequence = sequence.map((num) =>
      Math.round((max - num) * scaleFactor)
    );

    return rescaledSequence;
  }


  return (
    <div id="data_page">
      <CdemHeader />
      <div className="analysis_container">
        <div
          className="filter_container"
          onClick={() => {
            if (mapType === "riding" && selectedRiding !== 0) {
              setSelectedRiding(1);
            }
          }}
        >
          <SelectionTool
            dataset={dataset}
            setDataset={setDataset}
            setDepVar={setDepVar}
            setIndVar={setIndVar}
          />
          <IndVarDropDown
            indVar={indVar}
            setIndVar={setIndVar}
            dataset={dataset}
            depVar={depVar}
          />

          <FilterButtons
            dataset={dataset}
            indVar={indVar}
            setSelectedButton={setSelectedButton}
          />

          <DropdownMenu
            dataset={dataset}
            setDependentQuestion={setDepVar}
            depVar={depVar}
          />
          <button
            id="pdf-button"
            onClick={Export}
          >
            Export PDF
          </button>
          <div id="radio-buttons">
            <FormControl>
              <FormLabel id="map-control-group">Map Type</FormLabel>
              <RadioGroup
                aria-labelledby="map-control-group"
                name="cmap-control-group"
                value={mapType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="province"
                  control={<Radio />}
                  label="Province"
                />
                <FormControlLabel
                  value="riding"
                  control={<Radio />}
                  label="Riding"
                />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="column-chart-control-group">Chart Type</FormLabel>
              <RadioGroup
                aria-labelledby="column-chart-control-group"
                name="column-chart-control-group"
                value={columnChartType}
                onChange={handleChartChange2}
              >
                {/* Add radio buttons for different column chart types */}
                <FormControlLabel
                  value="ColumnChart"
                  control={<Radio />}
                  label="Column"
                />
                <FormControlLabel
                  value="PieChart"
                  control={<Radio />}
                  label="Pie"
                />
                {/* Add more options as needed */}
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="chart-control-group"></FormLabel>
              <RadioGroup
                aria-labelledby="chart-control-group"
                name="chart-control-group"
                value={chartType}
                onChange={handleChartChange}
              ></RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="data_container">
          <StatsBar dataset={dataset} depVar={depVar} />
          <div className="data_stats">
            <div className="statistic-box">
              <p className="statistic-label">Count:</p>
              <p className="statistic-value">
              {standardDeviation !== -1 || undefined ? totalCount : '---'}
              </p>
            </div>
            <div className="statistic-box">
              <p className="statistic-label">Mean:</p>
              <p className="statistic-value">
              {standardDeviation !== -1 || undefined ? Math.round(averageValue * 100) / 100 : '---'}
              </p>
            </div>
            <div className="statistic-box">
              <p className="statistic-label">Median:</p>
              <p className="statistic-value">
              {standardDeviation !== -1 || undefined ? median : '---'}
              </p>
            </div>
            <div className="statistic-box">
              <p className="statistic-label">Standard Deviation:</p>
              <p className="statistic-value">
              {standardDeviation !== -1 || undefined ? Math.round(standardDeviation * 100) / 100 : '---'}
              </p>
            </div>
          </div>
          <div id="data_map_component">
            <MapComponent
              mapData={mapData}
              mapType={mapType}
              setSelectedRiding={setSelectedRiding}
            />
          </div>
          <div id="my-table">
            {columnChartType === "ColumnChart" ? (
              depChartData.map((data, index) => {
                return (
                  <Chart
                    key={index} // Assuming index can be used as a unique key
                    width={"100%"}
                    chartType={columnChartType} // Use the state variable for dynamic chart type
                    data={data}
                    options={{
                      colors: chartColors, // Example chart colors
                      chartArea: { width: "60%", height: "70%" }, // Adjust the chart area as needed
                      // Other chart options...
                    }}
                  />
                );
              })
            ) : (
              <Chart
                width={"100%"}
                chartType={columnChartType} // Use the state variable for dynamic chart type
                data={data}
                options={{
                  colors: chartColors, // Example chart colors
                  chartArea: { width: "80%", height: "70%" }, // Adjust the chart area as needed
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
