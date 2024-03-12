export function addQuestionMapping(output: {independent: any, dependent: any}, questions: string[], parameters: any, surveyTemplate: {survey: any, hashSurvey: Map<string,any>}, quest: string, i: number, jsonDataset: any, questionsMapping: Map<string, number>): void {
      
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

    if(row?.Payload?.ChoiceOrder && output[questIndOrDep][questions[i]]?.answersMapping) {
      let answersMapping = output[questIndOrDep][questions[i]].answersMapping;
      let newAnswersMapping:any = {};

      row.Payload.ChoiceOrder.forEach((val:any, i:number) => {
     
        newAnswersMapping[i+1] = answersMapping[val];
      });
      output[questIndOrDep][questions[i]].answersMapping = newAnswersMapping;
    }
    
    //fetchDataset for questions[i] and get all unique values
    if(questTypeParam.fetchDataset) {
      let uniqueAnswers = new Map();

      for(let d = 1; d < jsonDataset.data.length; d++) {
        let index = questionsMapping.get(questions[i]);
        if(index) {
          if(!uniqueAnswers.has(jsonDataset.data[d][index])) {
            uniqueAnswers.set(jsonDataset.data[d][index], null);
          }
        } else {
          console.log(`There was an issue with the questionMapping where we couldn't find the index for "${questions[i]}".`);
        }
      }

      output[questIndOrDep][questions[i]]["uniqueAnswers"] = Array.from(uniqueAnswers.keys());
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