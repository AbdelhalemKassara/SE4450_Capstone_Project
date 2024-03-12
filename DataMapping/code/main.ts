import path from "path";
import { FileManager} from "./FileManager";
import { QsfFileFetchWrapper } from "./QsfFileFetchWrapper";
import { DatasetFetchWrapper } from "./DatasetFetchWrapper";
import { Mapping, MC } from "./Types";
const inputFiles = "inputFiles";



let fileManager: FileManager = new FileManager();
let datasetYearsDir: string[] = fileManager.getDirectories(path.join(inputFiles));


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
    let questionId: String = depVars[d];

    let type: String = qsfFile.getQuestionType(questionId);
    // console.log(type);
    //skip over the ones that don't exist in the qsf or don't have a type we can process
    if(!type || (type !== "MC")) {
      // console.log(`We couldn't process ${questionId} as it's type is something that we can't process (haven't implemented) or is undefined.`)
      continue;
    }

    //create the current questions mapping
    let curQuestMap: MC = {type: "MC", mainQuestion: "", answersMapping: {}};
    mappingFile.dependent[questionId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive

    //get and assing the values for the answer mapping
    let answerMap = curQuestMap.answersMapping;

    let choices = qsfFile.getAnswerMappingObj(questionId);
    
  }

}