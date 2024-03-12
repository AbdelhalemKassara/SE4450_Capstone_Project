import path from "path";
import { FileManager} from "./FileManager";
import { QsfFileFetchWrapper } from "./QsfFileFetchWrapper";
import { DatasetFetchWrapper } from "./DatasetFetchWrapper";
import { Mapping } from "./Types";
import { ProcessQuestions } from "./ProcessQuestions";

const inputFiles = "inputFiles";



const fileManager: FileManager = new FileManager();
let datasetYearsDir: string[] = fileManager.getDirectories(path.join(inputFiles));

const processQuest: ProcessQuestions = new ProcessQuestions();

let datasetNMapDirNames: String[] = new Array();

for(let i = 0; i < datasetYearsDir.length; i++) {
  let mappingFile: Mapping = {independent: {}, dependent: {}};
  
  //add the current year we are currently processing
  datasetNMapDirNames.push(datasetYearsDir[i]);
  
  //get the required file paths
  let datasetYearPath = path.join(inputFiles, datasetYearsDir[i]);

  let qsfFilePath: string = fileManager.getQsfFileNameInDir(datasetYearPath);
  let csvFilePath: string = fileManager.getCsvFileNameInDir(datasetYearPath);
  let paramtersPath: string = fileManager.getParamtersFileNameInDir(datasetYearPath);

  if(!qsfFilePath || !csvFilePath || !paramtersPath) {
    console.log(`The folder ${datasetYearPath} has qsf, csv, or json file missing.`);
    continue;    
  }

  //declare and create the qsf and dataset handler objects
  let qsfFile: QsfFileFetchWrapper = new QsfFileFetchWrapper(qsfFilePath, paramtersPath);
  let dataset: DatasetFetchWrapper = new DatasetFetchWrapper(csvFilePath);

  //get the question ids and loop over them
  let depVars: String[] = dataset.getQuestionIds();
  depVars = qsfFile.removeQuestionToIgnoreFromList(depVars);

  let indVars: String[] = qsfFile.getIndependentVariables();
  indVars = qsfFile.removeQuestionToIgnoreFromList(indVars);

  //loop over the dependent variables
  for(let d = 0; d < depVars.length; d++) {
    processQuest.addQuestion(mappingFile, qsfFile, depVars[d], false);
  } 

  //loop over the independent variables
  for(let d = 0; d < indVars.length; d++) {
    processQuest.addQuestion(mappingFile, qsfFile, depVars[d], true);
  }


  // console.log(inspect(mappingFile, {showHidden: false, depth: null, colors: true}));

  //write the mapping file
  let fileName: string = datasetYearsDir[i] + "-mapping.json";
  fileManager.writeFile(mappingFile, [datasetYearsDir[i]],  fileName);

  //write the dataset files
  let curYearFiles: String[] = new Array();

  let newDataset : String[][] = dataset.getDatasetWithSwappedRowAndCol();

  newDataset.forEach((column: String[]) => {
    if(column[0] !== "" && column[0] !== " ") {
      let fileName: string = column[0] + ".json";
      fileManager.writeFile(column, [datasetYearsDir[i]], fileName);
      curYearFiles.push(fileName);
    }
  });
  
  //write the file that contains all the datasets file names (i.e. the columns) (This file is needed as we can't fetch the filenames in the frontend we have to know them ahead of time)
  fileManager.writeFile(curYearFiles, [datasetYearsDir[i]], "datasetFileNames.json");
}

//creates a file that contains the folder names of the folders we created for each survey year (This file is needed as we can't fetch the filenames in the frontend we have to know them ahead of time)
fileManager.writeFile(datasetNMapDirNames, [], "dirNames.json");

