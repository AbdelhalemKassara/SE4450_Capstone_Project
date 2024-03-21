import fs, {PathLike} from 'fs';
import { AgeBracket, paramters } from './Types';
import { DatasetFetchWrapper } from './DatasetFetchWrapper';
const stringStripHtml = require('fix-esm').require('string-strip-html');

export class QsfFileFetchWrapper {
  //this class should contain the qsf file object
  //a bunch of descriptive functions that fetch objects from the qsf file.

  private qsfFile: any;
  private parametersFile: paramters;
  private questIDToObj = new Map<string, any>();
  private questionIdsFromQsfRmIndex0 = new Map<string, string>();

  constructor(qsfFilePath: PathLike, parametersFile: PathLike) {
    let file:any = fs.readFileSync(qsfFilePath).toString();
    if(file) {
      this.qsfFile = JSON.parse(file);
    } else {
      throw new Error(`There is no qsf file at ${qsfFilePath}.`);
    }

    file = fs.readFileSync(parametersFile).toString();

    if(file) {
      this.parametersFile = JSON.parse(file);
    } else {
      throw new Error(`There is no parameters file at ${parametersFile}.`);
    }

    this.hashQuestionIDToQuestionObject();
    this.hashRemovedFirstSegQuestId();
  }

  public getMainQuestion(questionId: string): string | undefined {
    if(this.questIDToObj.has(questionId)) {
      let question: string = this.questIDToObj.get(questionId).Payload.QuestionText;
      
      //cleaining up the string
      question = stringStripHtml.stripHtml(question).result;
      question = question.replace('\n', ' ');
      question = this.removeTemplateLiterals(question);

      return question; 
    } else {
      return undefined;
    }
  }

  private removeTemplateLiterals(questionText: string): string {
    let stLit;

    while(stLit !== -1) {
      stLit = -1;


      for(let i = 1; i < questionText.length; i++) {
        if(questionText[i-1] === "$" && questionText[i] === "{") {
          stLit = i;
        }
        if(stLit !== -1 && questionText[i] === "}") {
          questionText = questionText.slice(0, stLit-1) + questionText.slice(i+1, questionText.length);
          break;
        }
      }
    }

    return questionText;
  }
  public getChoiceOrderArr(questionId: string): string[] | undefined {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.ChoiceOrder;
    } else {
      return undefined;
    }
  }

  public getSnapToPos(questionId: string) : Boolean | undefined {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId)?.Payload?.Configuration?.SnapToGrid;
    } else {
      return undefined;
    }
  }
  public getAnswersOrderArr(questionId: string) : string[] | undefined {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.AnswerOrder;
    } else {
      return undefined;
    }
  }

  public getAnswerMappingObj(questionId: string): any {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.Choices;
    } else {
      return undefined;
    }
  }

  public getAnswerMappingObjSliderNMatrix(questionId: string): any {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.Answers;
    } else {
      return undefined;
    }
  }

  public getQuestionType(questionId: string) {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.QuestionType;
    } else {
      return undefined;
    }
  }

  //for now this will ignore both metadata and question to ignore as we aren't using the metadata
  public removeQuestionToIgnoreFromList(questionIds: string[]): string[] {
    questionIds = questionIds.filter((questionId: string) => {
      let split: string[] = questionId.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
      
      //ignores everything that contins _DO (at the end) since that is just the display order
      if(split.includes("_DO")) {
        return false;
      }

      for(let i = 0; i < this.parametersFile.variablesToIgnore.length; i++) {
        let varIgnore: string = this.parametersFile.variablesToIgnore[i];

        if(varIgnore === questionId) {
          return false;
        }
      }

      for(let i = 0; i < this.parametersFile.metadata.length; i++) {
        let metadataVar: string = this.parametersFile.metadata[i];
        
        if(metadataVar === questionId) {
          return false;
        }
      }

      return true;
    });

    return questionIds;
  }

  //this may cause issues and map to the wrong values
  public reformatNecissaryQuestions(questionIds: string[], dataset: DatasetFetchWrapper): string[] {
    let out: any = questionIds.map((questionId: string) => {
      let split: string[] = questionId.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
      split[0] = "";

      if(this.questIDToObj.has(questionId)) {
        return questionId;
      } else if(split.length > 1 && this.questionIdsFromQsfRmIndex0.has(split.join())) { //some questions have ds##, pes##, or dc## while the qsf file has another one of these, this assigns it to the one the qsf file has.        
        let newQuest: any = this.questionIdsFromQsfRmIndex0.get(split.join());
        dataset.updateQuestId(questionId, newQuest);
        return newQuest;
      } else {
        // console.log(`Warning: ${questionId} in the dataset doesn't exist in any form that we can find in the qsf file, it won't exist in the mapping file.`);
        return "";
      }
    });

    out = out.filter((questionId: string) => questionId !== "");//remove the question that have a warning

    return out;
  }

  public getIndependentVariables(): string[] {
    return this.parametersFile.independentVariables;
  }

  public getSurveyYear(): number {
    return this.parametersFile.surveyYear;
  }

  public getVarForAgeBrac(): string[] {
    return this.parametersFile.variableForAgeBrackets;
  }

  public getIsBirthYear(index: number): boolean {
    return this.parametersFile["AskingForBirthYearNotAge?"][index];
  }
  
  public getMaxBirthYear(): number {
    return this.parametersFile.maxBirthYear;
  }

  public getAgeBrackets(): AgeBracket[] {
    return this.parametersFile.ageBrackets;
  }
  
  public getDispBirthYear(): boolean {
    return this.parametersFile.DisplayBirthYearsNotAge;
  }

  private hashQuestionIDToQuestionObject() {
    this.qsfFile.SurveyElements.forEach((row: any) => {
      if(row?.Payload?.DataExportTag) {
        this.questIDToObj.set(row.Payload.DataExportTag, row);
      }
    });
  }

  private hashRemovedFirstSegQuestId() {
    //get ids without the first ds##, pes##, or dc##
    let questionIdsFromQsf: string[] = Array.from(this.questIDToObj.keys());

    questionIdsFromQsf.forEach((questionId: string) => {
      let split: string[] = questionId.split(/(?=_)/);

      split[0] = "";
      this.questionIdsFromQsfRmIndex0.set(split.join(), questionId);
    });


  }
  //hardcode each quesiton type
  //the parameters file is now specific to each dataset year and contains 
}