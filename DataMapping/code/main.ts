import Papa from 'papaparse';
import fs from 'fs';
import { getFilteredQuestions, hashSurveyTemplateQuestions, getQuestionMapping } from './processGlobalVars';
import { addQuestionMapping, addQuestionMappingMultiQuestion } from './helperFunctions';
//read and convert csv file to json
const jsonDataset: any = Papa.parse(fs.readFileSync('./inputFiles/Democracy Checkup 22_V1.csv').toString());

//get independent variables
const parameters = JSON.parse(fs.readFileSync('./inputFiles/parameters.json').toString());

//get the qsf survey
let surveyTemplate : {survey: any, hashSurvey: Map<string,any>} = {survey : {}, hashSurvey : new Map()};

surveyTemplate.survey = JSON.parse(fs.readFileSync('./inputFiles/DC_2022.json').toString());
//get and hash all question ids from the qsf file
surveyTemplate.hashSurvey = hashSurveyTemplateQuestions(surveyTemplate.survey);//key is the question, value is reference to it's row i.e. survey.SurveyElements[i]

//output file
//question : {type: string, ...} | {pointer : string}
let output : {independent: any, dependent: any} = {
  "independent" : {},
  "dependent" : {}
}

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

  if(new RegExp(/dc[0-9][0-9]/).test(sliceStr[0])) {//test to see if the string starts with ds22 and/or any other year
    sliceStr[1] = sliceStr[1].substring(1, sliceStr[1].length);
    sliceStr.shift();//removes first element in array
  }
  quest = sliceStr.join('');

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


//save the output to json file
fs.writeFile("./outputFiles/output.json", JSON.stringify(output), (err: any) => {
  if(err) {
    console.log(err);
  }
});
