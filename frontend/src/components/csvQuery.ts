let instance : csvQuery;

class csvQuery {
  private datasets : Map<string, any> = new Map();
  
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
      this.promises.push(...datasetNames);
      this.resolve();//to avoid race conditions

      datasetNames.forEach((file: any) => {
        this.promises.push(this.fetchDatasets(file));
      });

    } catch(err) {
      console.log(err);
    };

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
    let data = await response.json();

    let mapping: any = await fetch("datasets/" + files.mapping);
    mapping = await mapping.json();
    this.datasets.set(files.dataset, {"dataset": data, "mapping" : mapping});
  }


  //dataset query methods
  public async getDatasetsNames(): Promise<string[]> {
    await Promise.all(this.promises);
    return Array.from(this.datasets.keys());
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
  
  public async getAnswers(dataset: string) {
    await Promise.all(this.promises);

  }
}

export default csvQuery;