export function getFilteredQuestions(jsonDataset: any, parameters: any): string[] {
  //columns in the dataset we should ignore
  let colToIgnore = new Map();
  parameters.metadata.forEach((val: string) => {
    colToIgnore.set(val, null);
  });
  parameters.variablesToIgnore.forEach((val: string) => {
    colToIgnore.set(val, null);
  });
  
  //get an array of all question ids from survey
  return jsonDataset.data[0].filter((col: string) => !colToIgnore.has(col));
}

export function getQuestionMapping(questions: string[], jsonDataset: any) : Map<string, number> {
  let out: Map<string, number> = new Map();

  questions.forEach((quest: string) => {
    out.set(quest, jsonDataset.data[0].indexOf(quest));
  });

  return out;
}

export function hashSurveyTemplateQuestions(surveyTemplate: any) {
  //key is survey.SurveyElements[i].Payload.DataExportTag (i.e. the question id), value is reference to row i.e. survey.SurveyElements[i]
  const hashSurvey = new Map();//key is survey.SurveyElements[i].Payload.DataExportTag, value is reference to row i.e. survey.SurveyElements[i]

  surveyTemplate.SurveyElements.forEach((row: any) => {
    if(row?.Payload?.DataExportTag) {
      let sliceStr: string[] = row.Payload.DataExportTag.split(/(?<=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
      if(new RegExp(/dc[0-9][0-9]/).test(sliceStr[0])) {//test to see if the string starts with ds22 and/or any other year
        sliceStr.shift();//removes first element in array
      }
      hashSurvey.set(sliceStr.join(''), row);
    }
  });

  return hashSurvey;
}