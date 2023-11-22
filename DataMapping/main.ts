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
interface answers { id: string, answer: string }
interface question{ id: string, question: string, answers: answers[] }

let output : {independent: question[], dependent: question[]} = {
  "independent" : [],
  "dependent" : []
}






//save to json file
fs.writeFile("output.json", JSON.stringify(output), (err: any) => {
  if(err) {
    console.log(err);
  }
});