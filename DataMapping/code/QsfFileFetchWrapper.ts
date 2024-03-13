import fs, {PathLike} from 'fs';
import { paramters } from './Types';
import { DatasetFetchWrapper } from './DatasetFetchWrapper';
const stringStripHtml = require('fix-esm').require('string-strip-html');

export class QsfFileFetchWrapper {
  //this class should contain the qsf file object
  //a bunch of descriptive functions that fetch objects from the qsf file.

  private qsfFile: any;
  private parametersFile: paramters;
  private questIDToObj = new Map<String, any>();
  private questionIdsFromQsfRmIndex0 = new Map<String, String>();

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

  public getMainQuestion(questionId: String): String | undefined {
    if(this.questIDToObj.has(questionId)) {
      let question: string = this.questIDToObj.get(questionId).Payload.QuestionText;
      question = stringStripHtml.stripHtml(question).result;
      question = question.replace('\n', ' ');
      console.log(question);
      question = this.removeTemplateLiterals(question);
      console.log(question);
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
  public getChoiceOrderArr(questionId: String): String[] | undefined {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.ChoiceOrder;
    } else {
      return undefined;
    }
  }

  public getAnswerMappingObj(questionId: String): any {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.Choices;
    } else {
      return undefined;
    }
  }

  public getQuestionType(questionId: String) {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.QuestionType;
    } else {
      return undefined;
    }
  }

  //for now this will ignore both metadata and question to ignore as we aren't using the metadata
  public removeQuestionToIgnoreFromList(questionIds: String[]): String[] {
    questionIds = questionIds.filter((questionId: String) => {
      let split: String[] = questionId.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
      
      //ignores everything that contins _DO (at the end) since that is just the display order
      if(split.includes("_DO")) {
        return false;
      }

      //I only added this beacuse I don't know the reason why I removed them in the first place (I'm refactoring the code)
      ////////////////////////////remove this later (don't want to deal with these ones now)
      // if(split.includes("_TEXT")) {
      //   return false;
      // }

      for(let i = 0; i < this.parametersFile.variablesToIgnore.length; i++) {
        let varIgnore: String = this.parametersFile.variablesToIgnore[i];

        if(varIgnore === questionId) {
          return false;
        }
      }

      for(let i = 0; i < this.parametersFile.metadata.length; i++) {
        let metadataVar: String = this.parametersFile.metadata[i];
        
        if(metadataVar === questionId) {
          return false;
        }
      }

      return true;
    });

    return questionIds;
  }

  public reformatNecissaryQuestions(questionIds: String[], dataset: DatasetFetchWrapper): String[] {
    let out: any = questionIds.map((questionId: String) => {
      let split: String[] = questionId.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
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

    out = out.filter((questionId: String) => questionId !== "");//remove the question that have a warning

    return out;
  }
  public getIndependentVariables(): String[] {
    return this.parametersFile.independentVariables;
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
    let questionIdsFromQsf: String[] = Array.from(this.questIDToObj.keys());

    questionIdsFromQsf.forEach((questionId: String) => {
      let split: String[] = questionId.split(/(?=_)/);

      split[0] = "";
      this.questionIdsFromQsfRmIndex0.set(split.join(), questionId);
    });


  }
  //hardcode each quesiton type
  //the parameters file is now specific to each dataset year and contains 
}