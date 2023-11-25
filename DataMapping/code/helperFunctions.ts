export function addQuestionMapping(output: {independent: any, dependent: any}, questions: string[], parameters: any, surveyTemplate: {survey: any, hashSurvey: Map<string,any>}, quest: string, i: number): void {
      
  let row = surveyTemplate.hashSurvey.get(quest);
  if(parameters.questionTypes.filter((qType: any ) => qType?.type === row.Payload.QuestionType)) {//checks if this row's question type is in the paramters document
    let questIndOrDep: "independent" | "dependent" = parameters.independentVariables.includes(questions[i]) ? "independent" : "dependent";

    output[questIndOrDep][questions[i]]  = {type : row.Payload.QuestionType};

    //fetchQSF
    let questTypeParam = parameters.questionTypes.find((val : any) => val.type === row.Payload.QuestionType);

    questTypeParam.fetchQSF.forEach((elem: any) => {
      let data = row;

      elem.path.forEach((curObj: any) => {
        data = data[curObj];
      });

      output[questIndOrDep][questions[i]][elem.name] = data; 
    });

    //fetchDataset for questions[i] and get all unique values
    if(questTypeParam.fetchDataset) {

      // console.log(Object.keys(jsonDataset.data[1][questions[i]]));
    }
  } else {
    console.log(`"${row.Payload.QuestionType}" is not included in the paramaters file, please add it.`);
  }
}

export function addQuestionMappingMultiQuestion(slicedQuest: string, surveyTemplate: {survey: any, hashSurvey: Map<string,any>}) {
  let row = surveyTemplate.hashSurvey.get(slicedQuest);


  //fetchQSF

  //fetchDataset for all questions[i] where everything before the last _ matches and get all unique values

}