import FileFetcher from "./FileFetcher";
import { QuestionId, QuestionText, Count, AnswerText, FilteredMapData } from "./NewTypes";

let instance: DatasetQuery;

class DatasetQuery {
  private fileFetcher: FileFetcher = new FileFetcher();

  //all functions are async and return a promise

  constructor() {
    //making this a singleton class
    if (instance) {
      return instance;
    }
    instance = this;
  }

  public async init() {
    this.fileFetcher.init();
  }

  //public function to retrieve the DatasetNames: Query0
  public async getDatasetsNames(): Promise<string[]> {
    return this.fileFetcher.getDatasetsIds();
  }

  //public function to retrieve the Independent Questions: Query1
  public async getIndependentQuestions(datasetId: string): Promise<Map<QuestionId, QuestionText>> {
    let out: Map<QuestionId, QuestionText> = new Map<QuestionId, QuestionText>();

    const independentVarsIds: string[] = await this.fileFetcher.getIndependentVarsIds(datasetId);

    for (const colId of independentVarsIds) {
      const questionText: string = await this.fileFetcher.getQuestionText(datasetId, colId);
      out.set(colId, questionText);
    }

    return out;
  }


  //public function to retreieve the Dependent Questions: Query2
  public async getDependentQuestions(datasetId: string): Promise<Map<QuestionId, QuestionText>> {
    let out: Map<QuestionId, QuestionText> = new Map<QuestionId, QuestionText>();

    const dependentVarsIds = await this.fileFetcher.getDependentVarsIds(datasetId);

    for (const id of dependentVarsIds) {
      const questionText = await this.fileFetcher.getQuestionText(datasetId, id);
      out.set(id, questionText);
    }

    return out;
  }

  //public function to retreieve the Questions: Query3
  public async getQuestions(datasetId: string): Promise<Map<QuestionId, QuestionText>> {
    const independentQuestions = await this.getIndependentQuestions(datasetId);
    const dependentQuestions = await this.getDependentQuestions(datasetId);

    return new Map([...independentQuestions, ...dependentQuestions]);
  }


  //created a function to retrieve the answers: Query5
  public async getAnswersCount(datasetId: string, questionId: string): Promise<Map<AnswerText, Count>> {
    let out: Map<AnswerText, Count> = new Map<AnswerText, Count>();

    const colVals = await this.fileFetcher.getColsVals(datasetId, questionId);
    console.log(questionId, colVals);
    // Count occurrences of each answer
    colVals.forEach((answer: string) => {
      const stringValue: string = answer.valueOf(); // Convert string to string
      let curCount: number | undefined = out.get(stringValue);
      if (curCount) {
        out.set(stringValue, curCount + 1);
      } else {
        out.set(stringValue, 1);
      }
      
    });

    return out;
  }

  public async getAnswerCount(datasetId: string, questionId: string, answerText: string): Promise<number> {
    let out: number | undefined = (await this.getAnswersCount(datasetId, questionId)).get(answerText);

    if (out) {
      return out;
    } else {
      throw new Error(`Either the datasetId (${datasetId}) questionId (${questionId}) or answerText (${answerText}) is an invalid value getting passed into the getAnswerCount function.`);
    }

  }
  public async getAnswers(datasetId: string, questionId: string): Promise<string[]> {
    let colVals: AnswerText[] = await this.fileFetcher.getColsVals(datasetId, questionId);

    let map: Map<AnswerText, null> = new Map<AnswerText, null>();
    colVals = colVals.filter((questText: AnswerText) => {
      let bool: Boolean = map.has(questText);

      if (!bool) {
        map.set(questText, null);
      }

      return !bool;
    });

    return colVals;
  }

  //retreieve the total repsonse Query6
  public async getTotalResponses(datasetId: string, questionId: string): Promise<number> {
    // Retrieve all the responses for a question and returns the length of the array (Since no response is removed from this array).
    return (await this.fileFetcher.getColsVals(datasetId, questionId)).length;
  }


  public async getFilteredAnswersCount(datasetId: string, depQuestId: string, depAnswer: string, indQuestId: string): Promise<Map<AnswerText, Count>> {
    let out: Map<AnswerText, Count> = new Map<AnswerText, Count>();

    //these will have the same length
    let depAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, depQuestId);
    let indAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, indQuestId);
    // let proA: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, 'dc22_province');
    // let fedA: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, 'feduid');

    for (let i = 0; i < indAnswers.length; i++) {
      if (indAnswers[i] === depAnswer && depAnswers[i]) {
        //@ts-ignore: Not sure why it's giving an error as i'm checking if it's undefined in the if statement
        let id: string = depAnswers[i];
        console.log("hi " + depAnswer);
        let curCount: number | undefined = out.get(id);

        if (curCount) {
          out.set(id, curCount + 1);
        } else {
          out.set(id, 1);
        }
      }
    }

    return out;
  }

  public async getFilteredAnswersCounts(datasetId: string, depQuestId: string, depAnswer: string[], indQuestId: string, feduid: number): Promise<Map<AnswerText, Count>> {
    let out: Map<AnswerText, Count> = new Map<AnswerText, Count>();

    //these will have the same length
    let depAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, depQuestId);
    let indAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, indQuestId);
    let fedUids: string[] = await this.fileFetcher.getFeduid(datasetId);

    // let proA: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, 'dc22_province');
    // let fedA: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, 'feduid');
//console.log("fuck you " + depAnswer);
//console.log(depAnswer.length)
    for (let j = 0; j < depAnswer.length; j++) {
      for (let i = 0; i < indAnswers.length; i++) {
        if (indAnswers[i] === depAnswer[j] && depAnswers[i] && (feduid < 10000 || fedUids[i] === feduid.toString())) {
          //@ts-ignore: Not sure why it's giving an error as i'm checking if it's undefined in the if statement
          let id: string = depAnswers[i];
          //console.log("fuck " + depAnswer[i]);
          let curCount: number | undefined = out.get(id);

          if (curCount) {
            out.set(id, curCount + 1);
          } else {
            out.set(id, 1);
          }
        }
      }
    }

    return out;
  }

  public async getFeduid(datasetId: string): Promise<string[]> {
    return this.fileFetcher.getFeduid(datasetId);
  }

  public async getAnswerIds(datasetid: string, colId: string): Promise<Map<QuestionText, number>> {
    return this.fileFetcher.getAnswerIds(datasetid, colId);
  }

  public async getJSONPolygonFile(fileName: string): Promise<any> {
    return this.fileFetcher.getJSONPolygonFile(fileName);
  }

  public async getFilteredMapData(datasetId: string, depQuestId: string, depAnswer: string, indQuestId: string): Promise<FilteredMapData> {

    let out: FilteredMapData = {
      province: {},
      riding: {}
    };


    //these will have the same length
    let depAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, depQuestId);
    let indAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, indQuestId);
    let provAns: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, `${depQuestId.slice(0, 4)}_province`);
    let feduid: string[] = await this.fileFetcher.getFeduid(datasetId);

    for (let i = 0; i < indAnswers.length; i++) {
      if (indAnswers[i] === depAnswer && depAnswers[i] && provAns[i] && feduid[i]) {
        //@ts-ignore: Not sure why it's giving an error as i'm checking if it's undefined in the if statement

        let provinceId: string = provAns[i];
        let provCount: number | undefined = out.province[provinceId];
        let ridingId: string = feduid[i];
        let fedCount: number | undefined = out.riding[ridingId]

        if (provCount) {
          out.province[provinceId] = provCount + 1;
        } else {
          out.province[provinceId] = 1;
        }
        if (fedCount) {
          out.riding[ridingId] = fedCount + 1;
        } else {
          out.riding[ridingId] = 1;
        }
      }

    }

    return out;
  }

  public async getFilteredMapDatas(datasetId: string, depQuestId: string, depAnswer: string[], indQuestId: string): Promise<FilteredMapData> {

    let out: FilteredMapData = {
      province: {},
      riding: {}
    };

//console.log("hi");
    //these will have the same length
    let depAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, depQuestId);
    let indAnswers: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, indQuestId);
    //console.log(datasetId);

    //console.log(`${depQuestId.slice(0, 4)}_province`);  
    let provAns: (undefined | string)[] = await this.fileFetcher.getColValsFullList(datasetId, `${depQuestId.split(/(?=_)/)[0]}_province`);
    let feduid: string[] = await this.fileFetcher.getFeduid(datasetId);

    for(let j = 0; j < depAnswer.length; j++){  
      //console.log("jimLahey")
      for (let i = 0; i < indAnswers.length; i++) {
        if (indAnswers[i] === depAnswer[j] && depAnswers[i] && provAns[i] && feduid[i]) {
          //@ts-ignore: Not sure why it's giving an error as i'm checking if it's undefined in the if statement

          let provinceId: string = provAns[i];
          let provCount: number | undefined = out.province[provinceId];
          let ridingId: string = feduid[i];
          let fedCount: number | undefined = out.riding[ridingId]

          if (provCount) {
            out.province[provinceId] = provCount + 1;
          } else {
            out.province[provinceId] = 1;
          }
          if (fedCount) {
            out.riding[ridingId] = fedCount + 1;
          } else {
            out.riding[ridingId] = 1;
          }
        }

      }
    }
    //console.log("this is the result ", out);
    return out;
  }


}

export default DatasetQuery;