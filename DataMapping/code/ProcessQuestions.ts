import { AgeBracket, AllQuestionTypes, answersMapping, Mapping, Matrix, MC, Slider, TE } from "./Types";
import { QsfFileFetchWrapper } from "./QsfFileFetchWrapper";
import { DatasetFetchWrapper } from "./DatasetFetchWrapper";

export class ProcessQuestions {
  constructor() {
  }

  public addQuestion(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean, dataset: DatasetFetchWrapper) {

    let type: string = qsfFile.getQuestionType(questionId);
 
    //only process the ones we have implemented the code for processing (these should be enouph unless there are more question types added to qualtrics)
    if(type === "MC") {
      this.processMC(mappingFile, qsfFile, questionId, addToIndVar);
      this.processAgeBrackets(mappingFile, qsfFile, questionId, addToIndVar, dataset);
      return;
    } else if(type === "TE") {
      this.processTE(mappingFile, qsfFile, questionId, addToIndVar, dataset);
      this.processAgeBrackets(mappingFile, qsfFile, questionId, addToIndVar, dataset);
      return;
    } 

    //remove the last _# from the id
    let split: string[] = questionId.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
    let subQId: string | undefined = split.pop();

    if(!subQId) {
      return;
    }

    let newQuestionId = split.join('');
    type = qsfFile.getQuestionType(newQuestionId);
    
    if(type === "Slider") {
      this.processSlider(mappingFile, qsfFile, newQuestionId, addToIndVar, dataset, questionId, subQId.slice(1));
      this.processAgeBrackets(mappingFile, qsfFile, questionId, addToIndVar, dataset);
    } else if(type === "Matrix") {
      //i might have accedentally swapped newQuestionId and quesitonId
      this.processMatrix(mappingFile, qsfFile, newQuestionId, addToIndVar, dataset, questionId, subQId.slice(1));
      this.processAgeBrackets(mappingFile, qsfFile, questionId, addToIndVar, dataset);
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
      if(value) {
        obj[id.valueOf()] = {Display: value};
        mapValToId.set(value, id);  
      } 
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

  private processMatrix(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean, dataset: DatasetFetchWrapper, originalQuestId: string, subQId: string) {
    //create the current questions mapping
    let curQuestMap: Matrix = {type: "Matrix", mainQuestion: "", answersMapping: {}};
    let datasetUpdateMapOldTNew: Map<string, string> = new Map<string, string>();

    //for some reason MappingFile.independent isn't getting passed by refrence or something (basically the one in main isn't getting modified)
    if(addToIndVar) {
      mappingFile.independent[originalQuestId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
    } else {
      mappingFile.dependent[originalQuestId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
    }

    //gets the mainQuestion 
    let temp: any = qsfFile.getMainQuestion(questionId);
    let mainQuestion: string = temp;
    if(!temp) {
      console.log(`Warning: Question ${questionId} doesn't have a MainQuestion attribute. (i.e. there wasn't any question text found.)`);
    } else {
      curQuestMap.mainQuestion = mainQuestion;
    }



    //get and assign values for the subQuestion
    let choices = qsfFile.getAnswerMappingObj(questionId);

    //remap the subquestion map with the choice order array
    temp = qsfFile.getChoiceOrderArr(questionId);
    if(!temp) {
      console.log(`Warning: Question ${questionId} doesn't have a ChoiceOrder array. (The answers may be mapped incorrectly).`);
    } else {
      let choiceOrder: string[] = temp;
      let newAnswerMapping: AllQuestionTypes = {};

      choiceOrder.forEach((choiceId: string, i: number) => {
        newAnswerMapping[(i + 1).toString()] = choices[choiceId.valueOf()];
      });

      choices = newAnswerMapping;
    }

    //some questions are using references to elements in the qsf file. we haven't implemented that kind of functionalty yet.
    if(!choices || !choices[subQId] || !choices[subQId].Display) {
      if(addToIndVar) {
        delete mappingFile.independent[originalQuestId.valueOf()];
      } else {
        delete mappingFile.dependent[originalQuestId.valueOf()];
      }
      return;
    }
    
    curQuestMap.mainQuestion += "   " + choices[subQId].Display;

    //set the answers in answer mapping (same code as above)
    let answers = qsfFile.getAnswerMappingObjSliderNMatrix(questionId);
    curQuestMap.answersMapping = {...answers};

    temp = qsfFile.getAnswersOrderArr(questionId);
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
    

  }

  private processSlider(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean, dataset: DatasetFetchWrapper, originalQuestId: string, subQId: string) {
    let snapToPos: Boolean | undefined = qsfFile.getSnapToPos(questionId);

    if(snapToPos) {
      //create the current questions mapping
      let curQuestMap: Slider = {type: "Slider", mainQuestion: "", answersMapping: {}};
      let datasetUpdateMapOldTNew: Map<string, string> = new Map<string, string>();

      //for some reason MappingFile.independent isn't getting passed by refrence or something (basically the one in main isn't getting modified)
      if(addToIndVar) {
        mappingFile.independent[originalQuestId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
      } else {
        mappingFile.dependent[originalQuestId.valueOf()] = curQuestMap;// the .valueOf() is to convert it from a string object to a string primitive
      }

      //gets the mainQuestion 
      let temp: any = qsfFile.getMainQuestion(questionId);
      let mainQuestion: string = temp;
      if(!temp) {
        console.log(`Warning: Question ${questionId} doesn't have a MainQuestion attribute. (i.e. there wasn't any question text found.)`);
      } else {
        curQuestMap.mainQuestion = mainQuestion;
      }



      //get and assign values for the subQuestion
      let choices = qsfFile.getAnswerMappingObj(questionId);

      //remap the subquestion map with the choice order array
      temp = qsfFile.getChoiceOrderArr(questionId);
      if(!temp) {
        console.log(`Warning: Question ${questionId} doesn't have a ChoiceOrder array. (The answers may be mapped incorrectly).`);
      } else {
        let choiceOrder: string[] = temp;
        let newAnswerMapping: AllQuestionTypes = {};

        choiceOrder.forEach((choiceId: string, i: number) => {
          newAnswerMapping[(i + 1).toString()] = choices[choiceId.valueOf()];
        });

        choices = newAnswerMapping;
      }

      //some questions are using references to elements in the qsf file. we haven't implemented that kind of functionalty yet.
      if(!choices || !choices[subQId] || !choices[subQId].Display) {
        if(addToIndVar) {
          delete mappingFile.independent[originalQuestId.valueOf()];
        } else {
          delete mappingFile.dependent[originalQuestId.valueOf()];
        }
        return;
      }
      
      curQuestMap.mainQuestion += "   " + choices[subQId].Display;

      //set the answers in answer mapping (same code as above)
      let answers = qsfFile.getAnswerMappingObjSliderNMatrix(questionId);
      curQuestMap.answersMapping = {...answers};

      temp = qsfFile.getAnswersOrderArr(questionId);
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
      
    } 
    //if Payload.SnapToGrid === true then treat is as a mc question, if it's not then treat it as it's own question type
  }

  private processAgeBrackets(mappingFile: Mapping, qsfFile: QsfFileFetchWrapper, questionId: string, addToIndVar: Boolean, dataset: DatasetFetchWrapper): void {
    let ageQuestIds = qsfFile.getVarForAgeBrac();

    let index: number = -1;
    for(let i = 0; i < ageQuestIds.length; i++) {
      if(questionId === ageQuestIds[i]) {
        index = i;
        break;
      }
    }
    if(index === -1) {
      return;
    }

    if(!addToIndVar) {
      console.log(`The variableForAgeBrackets in the paramters file should also be in the list for independentvariables for questionId ${questionId}.`);
      return;
    }


    
    let answerMap: any = mappingFile.independent[questionId].answersMapping;
    //take a look at the mapping of each of the age questions to CORRECT the paramters.json on which store the age and which store the birth year
    
    //I think we just need to update the values in the mapping in this case
    //this is wrong these aren't the ages this is remappping the ids
    if(!qsfFile.getIsBirthYear(index)) {
      //convert the dataset from age to birth year
      let surveyYear: number = qsfFile.getSurveyYear();

      for(let [id, obj] of Object.entries(answerMap)) {
        //@ts-ignore
        if(obj.Display !== undefined) {
          //@ts-ignore
          answerMap[id].Display = (surveyYear - Number(obj.Display)).toString();
        } 
      }
    }

    //process the ranges 
    let ageBracs: AgeBracket[] = qsfFile.getAgeBrackets();
    ageBracs.sort((a: AgeBracket, b: AgeBracket) => b.minBirthYear - a.minBirthYear);//youngest to oldest 

    //create the new answer mappings
    let newAnswerMapping: answersMapping = {};
    const surveyYear = qsfFile.getSurveyYear();
    
    let birthYear: number = Number(ageBracs[0].minBirthYear)+1;
    if(!qsfFile.getDispBirthYear()) {
      birthYear = surveyYear - birthYear;
    }

    newAnswerMapping["1"] = {Display: `younger than ${ageBracs[0].bracketName} (${birthYear}${qsfFile.getDispBirthYear() ? "+" : "-"})`};

    ageBracs.forEach((ageBrac: AgeBracket, i: number) => { //creates the new answer mapping
      let lowerBirthYear: number = ageBrac.minBirthYear;
      let upperBirthYear: number = i === 0? qsfFile.getMaxBirthYear() : Number(ageBracs[i-1].minBirthYear)-1;
      let DispBirthYear: boolean = qsfFile.getDispBirthYear();

      newAnswerMapping[(i+2).toString()] = {Display: `${ageBrac.bracketName} (${DispBirthYear ? lowerBirthYear : surveyYear - upperBirthYear} - ${DispBirthYear ? upperBirthYear : surveyYear - lowerBirthYear})`}//+2 because we are starting from 1 and for born before oldest bracket
    });

    birthYear = Number(ageBracs[ageBracs.length-1].minBirthYear)-1;
    newAnswerMapping[(ageBracs.length + 2).toString()] = {Display: `older than ${ageBracs[ageBracs.length-1].bracketName} (${qsfFile.getDispBirthYear() ? birthYear: (surveyYear - birthYear)} ${qsfFile.getDispBirthYear() ? "-": "+"})`};

    //create the map that will be used to update the ids in the dataset
    let oldIdsToNew: Map<string, string> = new Map<string, string>();
    for(let [id, obj] of Object.entries(answerMap)) {
        //@ts-ignore
        let oldAnsYear = Number(obj.Display);

        //@ts-ignore: younger than range
        if(oldAnsYear > qsfFile.getMaxBirthYear()) {
          oldIdsToNew.set(id, "1");
          continue;
        }

        //in range
        for(let i = 0; i < ageBracs.length; i++) {
          //@ts-ignore
          if(oldAnsYear >= Number(ageBracs[i].minBirthYear)) {
            oldIdsToNew.set(id, (i+2).toString());
            break;
          }
        }

        //@ts-ignore: older than range
        if(oldAnsYear < Number(ageBracs[ageBracs.length-1].minBirthYear)) {
          oldIdsToNew.set(id, (ageBracs.length + 2).toString());
        }
    }

    
    mappingFile.independent[questionId].answersMapping = newAnswerMapping;
    
    //update the dataset with the new ids
    dataset.updateQuestValues(questionId, oldIdsToNew);

  }
}