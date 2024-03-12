import Papa from 'papaparse';
import fs from 'fs';
import { getFilteredQuestions, hashSurveyTemplateQuestions, getQuestionMapping } from './processGlobalVars';
import { addQuestionMapping, addQuestionMappingMultiQuestion } from './helperFunctions';
import { Mapping } from './Types';




let dirs = getDirectories("./inputFiles");
for(let i = 0; i < dirs.length; i++) {
  processAYearsFiles("./inputFiles/" + dirs[i], dirs[i]);
}

function processAYearsFiles(folderPath: fs.PathLike, year: String) {
  let csvFilePath = getCsvFileInDir(folderPath);
  let qsfFilePath = getQsfFileInDir(folderPath);
  
  if(csvFilePath === undefined || qsfFilePath === undefined) {
    console.log("a FolderPath is invalid");
    return;
  }
  //read and convert csv file to json
  const jsonDataset: any = Papa.parse(fs.readFileSync(csvFilePath).toString());

  //get independent variables
  const parameters = JSON.parse(fs.readFileSync('./inputFiles/parameters.json').toString());

  //get the qsf survey

  let surveyTest: any = JSON.parse(fs.readFileSync(getQsfFileInDir(folderPath)).toString());
  let hashSurvey = hashSurveyTemplateQuestions(surveyTest);

  let surveyTemplate : {survey: any, hashSurvey: Map<string,any>} = {survey: surveyTest, hashSurvey: hashSurvey};
  //get and hash all question ids from the qsf file

  //output file
  //question : {type: string, ...} | {pointer : string}
  let output : Mapping = {
    independent : {},
    dependent : {}
  }

  //adding the question types

  //get an array of all question ids from survey
  const questions: string[] = getFilteredQuestions(jsonDataset, parameters);
  const questionsMapping: Map<string, number> = getQuestionMapping(questions, jsonDataset);



  for(let i = 0; i < questions.length; i++) {
    let quest: string = questions[i];
    let sliceStr: string[] = quest.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
    
    //ignores everything that contins D0 since that is just the display order
    if(sliceStr.includes("_DO")) {
      continue;
    }

    ////////////////////////////remove this later (don't want to deal with these ones now)
    if(sliceStr.includes("_TEXT")) {
      continue;
    }

    //pretty sure this does nothing now with the changes in the code
    //removes the number or "TEXT" tag at the end for matrix and Text entry
    sliceStr.pop();
    let slicedQuest: string = sliceStr.length > 0 ? sliceStr.join('') : quest;

 
    if(surveyTemplate.hashSurvey.has(quest)) {
      addQuestionMapping(output, questions, parameters, surveyTemplate, quest, i, jsonDataset, questionsMapping);
      
    } else if(slicedQuest !== quest && surveyTemplate.hashSurvey.has(slicedQuest)) {
      addQuestionMappingMultiQuestion(slicedQuest, surveyTemplate);
    } 
    else {
      console.log(`"for "${questions[i]}" in the raw csv file. "${quest}" and "${slicedQuest}"(substring of the first) isn't contained within the QSF file.`)
    }
  }

  //remove the unused questions/columns from the json version of the dataset and save the json version
  fs.writeFile("./outputFiles/" + year + "-dataset.json", JSON.stringify(jsonDataset), (err: any) => {
    if(err) {
      console.log(err);
    }
  });

  //save the output to json file
  fs.writeFile("./outputFiles/" + year + "-mapping.json", JSON.stringify(output), (err: any) => {
    if(err) {
      console.log(err);
    }
  });

}



function getDirectories(source: fs.PathLike) {
  return fs.readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
}

//type needs to be lowercase
function getAFileTypesPaths(source: fs.PathLike, type: String) {
  return fs.readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isFile()).map(dirent => dirent.name).filter(file => {
    let split = file.split(".");
    return split[split.length - 1].toLowerCase() === type;
  }).map(str => source + "/" + str)[0];
}
function getQsfFileInDir(source: fs.PathLike) {
  return getAFileTypesPaths(source, "qsf");
}

function getCsvFileInDir(source: fs.PathLike) {
  return getAFileTypesPaths(source, "csv");
}
