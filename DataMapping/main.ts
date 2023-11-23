const Papa = require('papaparse');
const fs = require('fs');

//read and convert csv file to json
let csvFile = fs.readFileSync('inputFiles/Democracy Checkup 22_V1.csv');///////////change this so it gets the file name through a json or automatically
csvFile = csvFile.toString();
const jsonDataset = Papa.parse(csvFile, {header : true});//in data object there is a 2d array [response n] [question ID]

console.log(jsonDataset.data[0]["dc22_quota_weight"]);


//get independent variables
let indVar = JSON.parse(fs.readFileSync('inputFiles/independentVariables.json'));
//notes about indvar file:
  //some other things in the word doc like feduid and fedname
  //also postal code isn't listed in the word doc


//get the qsf survey
let survey = JSON.parse(fs.readFileSync('inputFiles/DC_2022.json'));


//output file
type answer = { id: string, answer: string } | { pointer: string}
interface question{ id: string, question: string, answers: answer[] }

let output : {independent: question[], dependent: question[]} = {
  "independent" : [],
  "dependent" : []
}

//get all question ids from survey
//the question references to a field that needs to be filled in we should ask the prof about that

//for standard mc question
//check if "indVar.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for
//The question is located at "indVar.SurveyElements[i].Payload.QuestionText".
//The answers are located in "indVar.SurveyElements[i].Payload.Choices" in the format { "answerID" : { "Display" : "answer"}}
function mc(): answer {

}
//for "box" mc question (where there are multiple questions grouped together with same scale)
//check if "indVar.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The main question is located at "indVar.SurveyElements[i].Payload.QuestionText".
//for every single "question_number" just repeat the same thing for now (the answer data will be the same but the question data wil be different)
//The questions are located in "indVar.SurveyElements[i].Payload.Choices.'number'" in the format where number is "question_number" in question id. ex number = "1"
//The answers are located in "indVar.SurveyElements[i].Payload.Choices" in the format { "answerID" : { "Display" : "answer"}}
function boxMc(): answer {

}
//for long answer questions in a box
//check if "indVar.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The main question is located at "indVar.SurveyElements[i].Payload.QuestionText".
//have ex. dc22_origin_N point back to dc22_origin and dc22_origin will contain all the answers (since they all share the same question and answers)
//combine all single dc22_origin_N and get the unique answers
function boxLongAnswer(): answer {

}
//for long answer questions
//check if "indVar.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for
//The question is located at "indVar.SurveyElements[i].Payload.QuestionText".
//The answers are all unique responses from the dataset for this question
function longAnswer(): answer {

}
//for slider questions in a box
//check if "indVar.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The main question is located at "indVar.SurveyElements[i].Payload.QuestionText".
//The sub questions are located in "indVar.SurveyElements[i].Payload.Choices.'number'" in the format where number is "question_number" in question id. ex number = "1"
//The answers are located in "indVar.SurveyElements[i].Payload.Answers" in the format { "answerID" : { "Display" : "answer"}}
function boxSlider(): answer {

}
//for slider questions 
//check if "indVar.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The question is located at "indVar.SurveyElements[i].Payload.QuestionText".
//The answers are located in "indVar.SurveyElements[i].Payload.Choices" in the format { "answerID" : { "Display" : "answer"}}
function slider(): answer {

}

//save to json file
fs.writeFile("output.json", JSON.stringify(output), (err: any) => {
  if(err) {
    console.log(err);
  }
});