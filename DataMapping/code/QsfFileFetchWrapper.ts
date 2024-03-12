import fs, {PathLike} from 'fs';
import { paramters } from '../oldCode/Types';

export class QsfFileFetchWrapper {
  //this class should contain the qsf file object
  //a bunch of descriptive functions that fetch objects from the qsf file.

  private qsfFile: any;
  private parametersFile: paramters;
  private questIDToObj = new Map<String, any>();

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
  }

  public getMainQuestion(questionId: String): String | undefined {
    if(this.questIDToObj.has(questionId)) {
      return this.questIDToObj.get(questionId).Payload.QuestionText;
    } else {
      return undefined;
    }
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
    questionIds.filter((questionId: String) => {
      let split: String[] = questionId.split(/(?=_)/);//spilits in the form "asdf_asdf_asdf" to "asdf", "_asdf", "_asdf"
      
      //ignores everything that contins _DO (at the end) since that is just the display order
      if(split.includes("_DO")) {
        return false;
      }

      //I only added this beacuse I don't know the reason why I removed them in the first place (I'm refactoring the code)
      ////////////////////////////remove this later (don't want to deal with these ones now)
      if(split.includes("_TEXT")) {
        return false;
      }

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

  //hardcode each quesiton type
  //the parameters file is now specific to each dataset year and contains 
}