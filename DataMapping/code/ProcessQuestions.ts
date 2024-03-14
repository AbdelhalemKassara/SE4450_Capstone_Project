import { AllQuestionTypes, Mapping, MC, TE } from "./Types";
import { QsfFileFetchWrapper } from "./QsfFileFetchWrapper";
import { DatasetFetchWrapper } from "./DatasetFetchWrapper";

export class ProcessQuestions {
  constructor() {
  }

  public addQuestion(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean, dataset: DatasetFetchWrapper, year: string) {

    let type: string = qsfFile.getQuestionType(questionId);
 
    //only process the ones we have implemented the code for processing (these should be enouph unless there are more question types added to qualtrics)
    if(type === "MC") {
      this.processMC(mappingFile, qsfFile, questionId, addToIndVar);
      return;
    } else if(type === "TE") {
      this.processTE(mappingFile, qsfFile, questionId, addToIndVar, dataset);
      return;
    } 

    //remove the last _# from the id
    let split: string[] = questionId.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
    split.pop();
    questionId = split.join('');
    type = qsfFile.getQuestionType(questionId);


    if(type === "Slider") {
      // console.log(questionId);
    } else if(type === "Matrix") {
      // console.log(questionId);
    }

  }
  
  //private functions
  private processMC(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean) {
    //create the current questions mapping
    let curQuestMap: MC = {type: "MC", mainQuestion: "", answersMapping: {}};
    let datasetUpdateMapOldTNew: Map<string, string> = new Map<string, string>();

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
      let choiceOrder: string[] = temp;
      let newAnswerMapping: AllQuestionTypes = {};

      choiceOrder.forEach((choiceId: string, i: number) => {
        newAnswerMapping[(i + 1).toString()] = curQuestMap.answersMapping[choiceId.valueOf()];
      });

      curQuestMap.answersMapping = newAnswerMapping;
    }
    
    //update the values in the dataset to match the choice order array

    //gets the mainQuestion 
    temp = qsfFile.getMainQuestion(questionId);
    let mainQuestion: string = temp;
    if(!temp) {
      console.log(`Warning: Question ${questionId} doesn't have a MainQuestion attribute. (i.e. there wasn't any question text found.)`);
    } else {
      curQuestMap.mainQuestion = mainQuestion;
    }
  }

  private processTE(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean, dataset: DatasetFetchWrapper) {
    //make up ids and swap them with the values in the dataset
    let curQuestMap: TE = {type: "TE", mainQuestion: "", answersMapping: {}};

    //for some reason MappingFile.independent isn't getting passed by refrence or something (basically the one in main isn't getting modified)
    if(addToIndVar) {
      mappingFile.independent[questionId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
    } else {
      mappingFile.dependent[questionId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
    }

    //get the question values
    let questionValues: string[] = dataset.getDatasetColumn(questionId);

    //remove the duplicate question values
    let hashQuestionVals = new Map<string, null>();

    let filteredQuestionValues: string[] = questionValues.filter((value: string) => {
      let has: Boolean = hashQuestionVals.has(value);
      hashQuestionVals.set(value, null);

      return !has;
    });

    let obj: any = {};
    let mapValToId: Map<string, string> = new Map<string, string>();

    //generate the choice order object
    filteredQuestionValues.forEach((value: string, i) => {
      //+1 and .Display to stay consistant with MC mapping
      let id: string = (i+1).toString();

      obj[id.valueOf()] = {Display: value};
      mapValToId.set(value, id);
    });

    //gets the mainQuestion 
    let mainQuestion: string | undefined = qsfFile.getMainQuestion(questionId);

    if(!mainQuestion) {
      console.log(`Warning: Question ${questionId} doesn't have a MainQuestion attribute. (i.e. there wasn't any question text found.)`);
    } else {
      curQuestMap.mainQuestion = mainQuestion;
    }

    curQuestMap.answersMapping = obj;
    dataset.updateQuestValues(questionId, mapValToId);
  }

  private processMatrix(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean) {

  }

  private processSlider() {

  }

}