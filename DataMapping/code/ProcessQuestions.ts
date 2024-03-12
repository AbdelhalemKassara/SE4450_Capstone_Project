import { AllQuestionTypes, Mapping, MC } from "./Types";
import { QsfFileFetchWrapper } from "./QsfFileFetchWrapper";

export class ProcessQuestions {
  constructor() {
  }

  public addQuestion(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: String, addToIndVar: Boolean) {

    let type: String = qsfFile.getQuestionType(questionId);

    //skip over the ones that don't exist in the qsf or don't have a type we can process
    if(!type || (type !== "MC")) {
      // console.log(`We couldn't process ${questionId} as it's type is something that we can't process (haven't implemented) or is undefined.`)
      return;
    }

    if(type === "MC") {
      this.processMC(mappingFile, qsfFile, questionId, addToIndVar);
    } else if(type === "TE") {
      this.processTE();
    }

  }
  
  //private functions
  public processMC(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: String, addToIndVar: Boolean) {
    //create the current questions mapping
    let curQuestMap: MC = {type: "MC", mainQuestion: "", answersMapping: {}};
    
    //for some reason MappingFile.independent isn't getting passed by refrence or something (basically the one in main isn't getting modified)
    if(addToIndVar) {
      mappingFile.independent[questionId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
    } else {
      mappingFile.dependent[questionId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
    }

    //get and assing the values for the answer mapping
    let choices = qsfFile.getAnswerMappingObj(questionId);
    curQuestMap.answersMapping = {...choices};

    //remap the answer map with the choice order array
    let temp: any = qsfFile.getChoiceOrderArr(questionId);
    if(!temp) {
      console.log(`Warning: Question ${questionId} doesn't have a ChoiceOrder array. (The answers may be mapped incorrectly).`);
    } else {
      let choiceOrder: String[] = temp;
      let newAnswerMapping: AllQuestionTypes = {};

      choiceOrder.forEach((choiceId: String, i: number) => {
        newAnswerMapping[(i + 1).toString()] = curQuestMap.answersMapping[choiceId.valueOf()];
      });

      curQuestMap.answersMapping = newAnswerMapping;
    }

    //gets the mainQuestion 
    temp = qsfFile.getMainQuestion(questionId);
    let mainQuestion: String = temp;
    if(!temp) {
      console.log(`Warning: Question ${questionId} doesn't have a MainQuestion attribute. (i.e. there wasn't any question text found.)`);
    } else {
      curQuestMap.mainQuestion = mainQuestion;
    }
  }

  public processTE() {

  }
}