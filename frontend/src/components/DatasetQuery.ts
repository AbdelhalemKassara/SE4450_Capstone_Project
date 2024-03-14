import FileFetcher from "./FileFetcher";
import { QuestionId, QuestionText, Count, AnswerText } from "./NewTypes";

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
  public async getDatasetsNames(): Promise<String[]> {
    return this.fileFetcher.getDatasetsIds();
  }

  //public function to retrieve the Independent Questions: Query1
  public async getIndependentQuestions(datasetId: String): Promise<Map<QuestionId, QuestionText>> {
    let out: Map<QuestionId, QuestionText> = new Map<QuestionId, QuestionText>();

    const independentVarsIds: String[] = await this.fileFetcher.getIndependentVarsIds(datasetId);

    for (const colId of independentVarsIds) {
      const questionText: String = await this.fileFetcher.getQuestionText(datasetId, colId);
      out.set(colId, questionText);
    }

    return out;
  }

  //public function to retreieve the Dependent Questions: Query2
  public async getDependentQuestions(datasetId: String): Promise<Map<QuestionId, QuestionText>> {
    let out: Map<QuestionId, QuestionText> = new Map<QuestionId, QuestionText>();

    const dependentVarsIds = await this.fileFetcher.getDependentVarsIds(datasetId);

    for (const id of dependentVarsIds) {
      const questionText = await this.fileFetcher.getQuestionText(datasetId, id);
      out.set(id,questionText);
    }

    return out;
  }

  //public function to retreieve the Questions: Query3
  public async getQuestions(datasetId: String): Promise<Map<QuestionId, QuestionText>> {
    const independentQuestions = await this.getIndependentQuestions(datasetId);
    const dependentQuestions = await this.getDependentQuestions(datasetId);

    return new Map([...independentQuestions, ...dependentQuestions]);
  }

  //created a function to retrieve the answers: Query5
  public async getAnswersCount(datasetId: String, questionId: String): Promise<Map<AnswerText, Count>> {
    let out: Map<AnswerText, Count> = new Map<AnswerText, Count>();
    
    const colVals = await this.fileFetcher.getColsVals(datasetId, questionId);

    // Count occurrences of each answer
    colVals.forEach((answer: String) => {
      const stringValue: string = answer.valueOf(); // Convert String to string
      let curCount : number | undefined = out.get(stringValue);
      if(curCount) {
        out.set(stringValue, curCount + 1);
      } else {
        out.set(stringValue, 1);
      }

    });

    return out;
  }

  public async getAnswers(datasetId: String, questionId: String): Promise<AnswerText[]> {
    let colVals: AnswerText[] = await this.fileFetcher.getColsVals(datasetId, questionId);

    let map:Map<AnswerText, null> = new Map<AnswerText, null>();
    colVals = colVals.filter((questText: AnswerText) => {
      let bool: Boolean = map.has(questText);
      
      if(!bool) {
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



}

export default DatasetQuery;