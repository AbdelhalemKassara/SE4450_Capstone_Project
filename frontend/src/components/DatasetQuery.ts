import FileFetcher from "./FileFetcher";

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
  public async getIndependentQuestions(datasetId: String): Promise<{ key: String; value: any }[]> {
    console.log(datasetId);
    const independentVarsIds = await this.fileFetcher.getIndependentVarsIds(datasetId);
    const questions: { key: String; value: any }[] = [];
    for (const colId of independentVarsIds) {
      const questionText = await this.fileFetcher.getQuestionText(datasetId, colId);
      questions.push({ key: colId, value: questionText });
    }
    return questions;
  }

  //public function to retreieve the Dependent Questions: Query2
  public async getDependentQuestions(datasetId: String): Promise<{ key: String; value: String }[]> {
    const dependentVarsIds = await this.fileFetcher.getDependentVarsIds(datasetId);
    const questions: { key: String; value: String }[] = [];
    for (const id of dependentVarsIds) {
      const questionText = await this.fileFetcher.getQuestionText(datasetId, id);
      questions.push({ key: id, value: questionText });
    }
    return questions;
  }

  //public function to retreieve the Questions: Query3
  public async getQuestions(datasetId: String): Promise<{ key: String; value: String }[]> {
    const independentQuestions = await this.getIndependentQuestions(datasetId);
    const dependentQuestions = await this.getDependentQuestions(datasetId);
    return [...independentQuestions, ...dependentQuestions];
  }

  //created a function to retrieve the answers: Query4
  public async getAnswers(datasetId: String, questionId: String): Promise<Object> {

    const colVals = await this.fileFetcher.getColsVals(datasetId, questionId);
    const answers: { [key: string]: number } = {};

    // Count occurrences of each answer
    colVals.forEach((answer: String) => {
      const stringValue: string = answer.valueOf(); // Convert String to string
      answers[stringValue] = (answers[stringValue] || 0) + 1;

    });

    return answers as Object; // Type assertion
  }
  public async getAnswersCount(datasetId: String, questionId: String): Promise<Object> {
    const colVals = await this.fileFetcher.getColsVals(datasetId, questionId);
    const counts: { [key: string]: number } = {};

    // Count occurrences of each answer
    colVals.forEach((answer: String) => {
      const stringValue: string = answer.valueOf(); // Convert String to string
      counts[stringValue] = (counts[stringValue] || 0) + 1;
    });

    return counts as Object; // Type assertion
  }

  //retreieve the total repsonse Query6
  public async getTotalResponses(datasetId: string, questionId: string): Promise<number> {
    // Retrieve the counts of answers for the specified question in the given dataset.
    const answersCount = await this.getAnswersCount(datasetId, questionId);

    // Calculate the total number of responses by summing up the counts of each answer.
    const totalResponses: number = Object.values(answersCount).reduce((total: number, count: number) => total + count, 0);

    return totalResponses;
  }



}

export default DatasetQuery;