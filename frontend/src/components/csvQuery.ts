import { DatasetNMap } from "./Types";
let instance: csvQuery;

//other notes
/*
- Maybe create a fileManager class that deals with all the file names, and its functions takes in at most a datasetId and a fileName (might have forgotten some stuff)
- maybe create two version where one outputs exactly the same format as the old function and the other is a new and updated version
*/
//public functions
/*
  //this is the id that is used to identify the dataset and is displayed to the user
  public async getDatasetsNames(): Promise<string[]>

  ////////////////This doesn't seem to be getting used
  //returns independent and dependet questions (I'm pretty sure it returns their ids as the key and the actual question text on as the value)
  public async getQuestions(dataset: string): Promise<{key : string, value : string}[]> {

  //returns the independent questions ^
  public async getIndependentQuestions(dataset: string): Promise<{key : string, value : any}[]> {

  //returns the dependent questions ^^
  public async getDependentQuestions(dataset: string) : Promise<{key : string, value : string}[]> {
  

  //I think this gets the answer mapping (Maybe change this to a Map<QuestionId, answerMapping>)
  public async getAnswers(dataset: string, questionId: string): Promise<Object> {

  //this seems to return a count of for each of the possible responses for a question (no idea about the structure of the output)
  public async getAnswersCount(dataset: string, questionId: string): Promise<any> {
  
  //this takes in a dependent, independent variable, dataset, and maybe a possibleDepREsp# (so it will return only of of the inner objects)
  //note this is just a structure I made up this might not actually be the structure that this function is returning.
  {
    possibleDepResp1: {
      possibleIndResp1: ###count,
      possibleIndResp2: ###count
    },
    possibleDepResp2: {
      possibleIndResp1: ###count,
      possibleIndREsp2: ###count
    }
  }
  // getes the count of filtered answers for a specific question in a given dataset.
  public async getFilteredAnswersCount(dataset: string, questionId: string, filterId: string, filter: string): Promise<any> {

  // gets the count for a specific answer and question
  public async getAnswerCount(dataset: string, questionId: string, answerId: string) {

  //gets the total responses for a specific question (note this is implemented incorrectly it should be checking for a -99  (-99 means no reponse in the dataset) (there might be addtional values to check for but im pretty sure -99 is the only one))
  public async getTotalResponses(dataset: string, questionId: string): Promise<number>  {
*/



class csvQuery {
  private datasets: Map<string, DatasetNMap> = new Map();
  private questionCol: Map<string, number> = new Map();
  private datasetNames: string[] = [];

  //bottom two are to avoid race conditions
  private resolve: any;
  private initialized = new Promise((res, reject) => {
    this.resolve = res;
  });

  private promises: any = [this.initialized];


  constructor() {
    //making this a singleton class
    if (instance) {
      return instance;
    }
    instance = this;

    this.init();
  }

  //query dataset
  //query mapping
  //paramter list: ("dataset", "")
  // console.log(await database.getDatasetsNames());
  // console.log(await database.getIndependentQuestions("2022-dataset.json"));
  // console.log(await database.getDependentQuestions("2022-dataset.json"));
  // console.log(await database.getQuestions("2022-dataset.json"));
  // database.getAnswers("2022-dataset.json", "dc22_age_in_years")
  // console.log()
  // database.getAnswersCount("2022-dataset.json", "dc22_age_in_years")
  // database.getAnswers("2022-dataset.json", "dc22_age_in_years")
  // database.getAnswersCount("2022-dataset.json", "dc22_provvote") 
  // database.getAnswers("2022-dataset.json", "dc22_provvote")
  // console.log(await database.getAnswersCount("2022-dataset.json", "dc22_age_in_years"));
  // console.log(await database.getAnswerCount("2022-dataset.json", "dc22_age_in_years", "12"));
  // console.log(await database.getTotalResponses("2022-dataset.json", "dc22_age_in_years"));

  //query values from dataset passing in a header in the mapping and returning 


  private async init() {
    try {
      let datasetNames = await this.fetchDatasetNames();

      //janky solution for fixing issue where the getDatasetsNames function returns an empty array
      this.promises.push(...datasetNames);
      datasetNames.forEach((value: any) => {
        this.datasetNames.push(value.dataset);
      });

      datasetNames.forEach((file: any) => {
        this.promises.push(this.fetchDatasets(file));
      });

    } catch (err) {
      console.log(err);
    };

    this.resolve();//to avoid race conditions
  }
  private async fetchDatasetNames() {
    let data: any = await fetch('datasets/fileNames.json');
    data = await data.json();

    //checks if the format is valid
    if (true) {
      return data;
    } else {
      throw Error("The dataset names json file is invalid.")
    }
  }

  //sending the json version of the dataset is ~20% larger but no processing is required which can take at best a couple of seconds (on good hardware on a desktop) 
  private async fetchDatasets(files: any) {
    let response = await fetch("datasets/" + files.dataset);
    this.promises.push(response);
    let data = await response.json();
    this.promises.push(data);
    //set the question to row number mapping
    data.data[0].forEach((question: string, i: number) => {
      this.questionCol.set(question, i);
    });

    let mapping: any = await fetch("datasets/" + files.mapping);
    this.promises.push(mapping);
    mapping = await mapping.json();
    this.promises.push(mapping);
    this.datasets.set(files.dataset, { "dataset": data, "mapping": mapping });
    return;
  }


  //dataset query methods
  public async getDatasetsNames(): Promise<string[]> {
    await Promise.all(this.promises);

    //previous way of getting the datasets name see comment above about this function
    //return Array.from(this.datasets.keys());

    return this.datasetNames;
  }
  public async getQuestions(dataset: string): Promise<{ key: string, value: string }[]> {
    await Promise.all(this.promises);
    return [...await this.getIndependentQuestions(dataset), ...await this.getDependentQuestions(dataset)];
  }

  public async getIndependentQuestions(dataset: string): Promise<{ key: string, value: any }[]> {
    await Promise.all(this.promises);
    return this.getQuestionsMethod(dataset, "independent");
  }

  public async getDependentQuestions(dataset: string): Promise<{ key: string, value: string }[]> {
    await Promise.all(this.promises);
    console.log(this.datasets.get(dataset));
    return this.getQuestionsMethod(dataset, "dependent");
  }
  private async getQuestionsMethod(dataset: string, questionsType: "independent" | "dependent"): Promise<{ key: string, value: string }[]> {
    await Promise.all(this.promises);
    //invalid question type
    if (questionsType !== "independent" && questionsType !== "dependent") {
      return [];
    }

    let out: { key: string, value: string }[] = [];
    for (let [key, value] of Object.entries(this.datasets.get(dataset).mapping[questionsType])) {
      if (value && value.hasOwnProperty('mainQuestion')) {
        out.push({
          key: key,
          //@ts-ignore: can't figure out how to fix the typescript error
          value: value.mainQuestion
        });
      }
    }

    return out;
  }


  //the mapping is incorrect because there is a property called "RecodeValues" that maps the numbers this is currenly using to the correct numbers 
  //(i.e. the issue is with the DataMapping code. I think all questions have this property so you can just remap all of them)
  public async getAnswers(dataset: string, questionId: string): Promise<Object> {
    await Promise.all(this.promises);

    let mapping = this.datasets.get(dataset)?.mapping;

    //unique answers are for text entry questions
    if (mapping?.dependent[questionId]?.uniqueAnswers) {
      return mapping?.dependent[questionId]?.uniqueAnswers;
    } else if (mapping?.dependent[questionId]?.answersMapping) {
      return mapping.dependent[questionId].answersMapping;
    } else if (mapping?.independent[questionId]?.answersMapping) {
      return mapping.independent[questionId].answersMapping;
    } else if (mapping?.independent[questionId]?.uniqueAnswers) {
      return mapping.independent[questionId].uniqueAnswers;
    } else {
      return {};
    }
  }

  //this function doesn't seem to work when the key is not a number in the output(format: {key1: val1, key2: val2})
  public async getAnswersCount(dataset: string, questionId: string): Promise<any> {
    await Promise.all(this.promises);

    let col = this.questionCol.get(questionId);
    let answersMapping = await this.getAnswers(dataset, questionId);


    if (col) {
      let out: any = {};
      let data = this.datasets.get(dataset).dataset.data;
      let valueToAnswerId: Map<string, any> = new Map();

      for (let [key, value] of Object.entries(answersMapping)) {
        valueToAnswerId.set(key, value.Display);
      }

      for (let i = 1; i < data.length; i++) {
        let curAnswer = valueToAnswerId.get(data[i][col]);


        if (curAnswer === undefined) {
          console.log("curAnswer is undefined");
        }

        if (out[curAnswer]) {
          out[curAnswer]++;
        } else if (curAnswer !== undefined) {//removes the -99 or no response
          out[curAnswer] = 1;
        }
      }

      return out;
    } else {
      return {};
    }

  }

  // Asynchronous function to get the count of filtered answers for a specific question in a given dataset.
  public async getFilteredAnswersCount(dataset: string, questionId: string, filterId: string, filter: string): Promise<any> {
    //console.log("Start of getFilteredAnswersCount");

    await Promise.all(this.promises);

    // Get the column index for the specified question.
    let col = this.questionCol.get(questionId);
    let fil = this.questionCol.get(filterId);

    // Get the mapping of answers for the specified question in the given dataset.
    let answersMapping = await this.getAnswers(dataset, questionId);
    let filterMapping = await this.getAnswers(dataset, filterId);


    // Check if the column index exists.
    if (col) {
      // Initialize an object to store the count of filtered answers.
      let out: any = {};

      // Get the dataset for the specified dataset.
      let data = this.datasets.get(dataset).dataset.data;

      // Create a mapping from answer values to their corresponding answer IDs.
      let valueToAnswerId: Map<string, any> = new Map();
      for (let [key, value] of Object.entries(answersMapping)) {
        valueToAnswerId.set(key, value.Display);
      }

      // Create a mapping from answer values to their corresponding answer IDs.
      let valueToFilterId: Map<string, any> = new Map();
      for (let [key, value] of Object.entries(filterMapping)) {
        valueToFilterId.set(key, value.Display);
      }

      let filterKey;

      for (const [key, value] of valueToFilterId.entries()) {
        if (value === filter) {
          filterKey = key;
          break;
        }
      }


      // Log the mapping for debugging purposes.
      console.log("test", valueToAnswerId);
      console.log("the filter is ", valueToFilterId);

      // Flag to log the first occurrence of a non-"1", "2", "3", or "4" response.
      let once = true;

      // Iterate through the dataset starting from index 1 (assuming index 0 is headers).
      for (let i = 1; i < data.length; i++) {
        // Get the current answer for the specified question.
        let curAnswer = valueToAnswerId.get(data[i][col]);


        // Check if the filter column is defined before using it as an index
        if (typeof fil !== 'undefined') {
          // Check if the current row should be ignored based on the filter condition.
          if (typeof data[i][fil] === 'undefined') {
            console.log(`Value for ${fil} is undefined at index ${i}. Skipping this row.`);
            continue; // Skip this iteration if the filter condition is not met.
          }

          if (data[i][fil] != filterKey) {
            continue; // Skip this iteration if the filter condition is met.
          }
        } else {
          console.log('Filter column is undefined. Skipping row.');
          continue; // Skip this iteration if the filter column is not defined.
        }

        // Check if the current answer is not "1", "2", "3", or "4".
        if (data[i][col] !== "1" && data[i][col] !== "2" && data[i][col] !== "3" && data[i][col] !== "4") {
          //console.log('first', data[i][col]);
          once = false;
        }

        // Log a message if the current answer is undefined.
        if (curAnswer === undefined) {
          console.log("curAnswer is undefined");
        }

        // Count occurrences of each answer and store the counts in the 'out' object.
        if (out[curAnswer]) {
          out[curAnswer]++;
        } else if (curAnswer !== undefined) {
          // If the answer is not undefined, initialize the count to 1.
          out[curAnswer] = 1;
        }
      }

      // Return the object containing the count of filtered answers.
      return out;
    } else {
      // Return an empty object if the column index does not exist.
      return {};
    }
  }


  public async getAnswerCount(dataset: string, questionId: string, answerId: string) {
    await Promise.all(this.promises);
    let val = await this.getAnswersCount(dataset, questionId);
    return val[answerId];
  }

  public async getTotalResponses(dataset: string, questionId: string): Promise<number> {
    await Promise.all(this.promises);
    let val = await this.getAnswersCount(dataset, questionId);

    //@ts-ignore: can't figure out how to fix the typescript error

    return (Object.values(val)).reduce((partialSum: number, cur: number) => partialSum + cur, 0);
  }

  public async getProvinceCount(dataset: string, questionId: string): Promise<any> {
    await Promise.all(this.promises);

    let col = this.questionCol.get(questionId);
    let answersMapping = await this.getAnswers(dataset, questionId);
    


    if(col) {
      let out: any = {};
      let data = this.datasets.get(dataset).dataset.data;
      let valueToAnswerId: Map<string, any> = new Map();

      for(let [key, value] of Object.entries(answersMapping)) {
        valueToAnswerId.set(key, value.Display);
      }

      // console.log("test", valueToAnswerId);

      let once = true;
      for(let i = 1; i < data.length; i++) {
        let curAnswer = valueToAnswerId.get(data[i][col]);
        if(data[i][col] !== "1" && data[i][col] !== "2" && data[i][col] !== "3" && data[i][col] !== "4") {
          //console.log("test", valueToAnswerId);
          // console.log('first', data[i][col])

          once= false;
        }
        
        if(curAnswer === undefined) {
          console.log("curAnswer is undefined");
        }

        if(out[curAnswer]) {
          out[curAnswer].total ++;
        } else if(curAnswer !== undefined) {//removes the -99 or no response
          out[curAnswer] = {province_id: data[i][col], total: 1};
        }
      }

      return out;
    } else {
      return {};
    }

  }

}

export default csvQuery;
