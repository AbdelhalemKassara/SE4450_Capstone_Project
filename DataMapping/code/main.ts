import path from "path";
import { FileManager} from "./FileManager";
import { QsfFileFetchWrapper } from "./QsfFileFetchWrapper";
import { DatasetFetchWrapper } from "./DatasetFetchWrapper";
import { AllQuestionTypes, Mapping, MC } from "./Types";
import {inspect} from 'util';
import { ProcessQuestions } from "./ProcessQuestions";

const inputFiles = "inputFiles";



const fileManager: FileManager = new FileManager();
let datasetYearsDir: string[] = fileManager.getDirectories(path.join(inputFiles));

const processQuest: ProcessQuestions = new ProcessQuestions();


for(let i = 0; i < datasetYearsDir.length; i++) {
  let mappingFile: Mapping = {independent: {}, dependent: {}};

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

  for(let d = 0; d < indVars.length; d++) {
    processQuest.addQuestion(mappingFile, qsfFile, depVars[d], true);
  }
  //loop over the independent variables
  // console.log(inspect(mappingFile, {showHidden: false, depth: null, colors: true}));

  //write the mapping file
  fileManager.writeFile(mappingFile, [datasetYearsDir[i]],  datasetYearsDir[i] + "-mapping.json");
  
  
  
  //break up the the dataset to [column][row] from [row][column] and make each column a separate file

}