let instance : csvQuery;

class csvQuery {
  private datasets : Map<string, any> = new Map();
  private questionCol: Map<string, number> = new Map();
  private datasetNames : string[] = [];

  //bottom two are to avoid race conditions
  private resolve: any;
  private initialized = new Promise((res, reject) => {
    this.resolve = res;
  });

  private promises: any = [this.initialized];


  constructor() {
    //making this a singleton class
    if(instance) {
      return instance;
    }
    instance = this;    

    this.init();
  }

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

    } catch(err) {
      console.log(err);
    };
    
    this.resolve();//to avoid race conditions
  }
  private async fetchDatasetNames() {
    let data: any = await fetch('datasets/fileNames.json');
    data = await data.json();
    
    //checks if the format is valid
    if(true) {
      return data;
    } else {
      throw Error("The dataset names json file is invalid.")
    }
  }

  //sending the json version of the dataset is ~20% larger but no processing is required which can take at best a couple of seconds (on good hardware on a desktop) 
  private async fetchDatasets(files : any) {    
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
    this.datasets.set(files.dataset, {"dataset": data, "mapping" : mapping});
    return;
  }


  //dataset query methods
  public async getDatasetsNames(): Promise<string[]> {
    await Promise.all(this.promises);

    //previous way of getting the datasets name see comment above about this function
    //return Array.from(this.datasets.keys());

    return this.datasetNames;
  }
  public async getQuestions(dataset: string): Promise<{key : string, value : string}[]> {
    await Promise.all(this.promises);
    return [...await this.getIndependentQuestions(dataset), ...await this.getDependentQuestions(dataset)];
  }

  public async getIndependentQuestions(dataset: string): Promise<{key : string, value : any}[]> {
    await Promise.all(this.promises);
    return this.getQuestionsMethod(dataset, "independent");
  }

  public async getDependentQuestions(dataset: string) : Promise<{key : string, value : string}[]> {
    await Promise.all(this.promises);
    return this.getQuestionsMethod(dataset, "dependent");
  }
  private async getQuestionsMethod(dataset: string, questionsType: "independent" | "dependent"): Promise<{key : string, value : string}[]> {
    await Promise.all(this.promises);
    //invalid question type
    if(questionsType !== "independent" && questionsType !== "dependent") {
      return [];
    }

    let out: {key : string, value : string}[] = [];
    for(let [key, value] of Object.entries(this.datasets.get(dataset).mapping[questionsType])) {
      if(value && value.hasOwnProperty('mainQuestion')) {
        out.push({
          key : key,
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

    if(mapping?.dependent[questionId]?.uniqueAnswers) {
        return mapping?.dependent[questionId]?.uniqueAnswers;
      } else if(mapping?.dependent[questionId]?.answersMapping) {
        return mapping.dependent[questionId].answersMapping;
      } else if (mapping?.independent[questionId]?.answersMapping){
        return mapping.independent[questionId].answersMapping;
      } else if (mapping?.independent[questionId]?.uniqueAnswers){
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


    if(col) {
      let out: any = {};
      let data = this.datasets.get(dataset).dataset.data;
      let valueToAnswerId: Map<string, any> = new Map();

      for(let [key, value] of Object.entries(answersMapping)) {
        valueToAnswerId.set(key, value.Display);
      }

      console.log("test", valueToAnswerId);

      let once = true;
      for(let i = 1; i < data.length; i++) {
        let curAnswer = valueToAnswerId.get(data[i][col]);
        if(data[i][col] !== "1" && data[i][col] !== "2" && data[i][col] !== "3" && data[i][col] !== "4") {
          //console.log("test", valueToAnswerId);
          console.log('first', data[i][col])

          once= false;
        }
        
        if(curAnswer === undefined) {
          console.log("curAnswer is undefined");
        }

        if(out[curAnswer]) {
          out[curAnswer]++;
        } else if(curAnswer !== undefined) {//removes the -99 or no response
          out[curAnswer] = 1;
        }
      }

      return out;
    } else {
      return {};
    }

  }

  public async getAnswerCount(dataset: string, questionId: string, answerId: string) {
    await Promise.all(this.promises);
    let val = await this.getAnswersCount(dataset, questionId);
    return val[answerId];
  }

  public async getTotalResponses(dataset: string, questionId: string): Promise<number>  {
    await Promise.all(this.promises);
    let val = await this.getAnswersCount(dataset, questionId);
    
    //@ts-ignore: can't figure out how to fix the typescript error
    
    return (Object.values(val)).reduce((partialSum: number, cur: number) => partialSum + cur, 0);
  }
}

export default csvQuery;

