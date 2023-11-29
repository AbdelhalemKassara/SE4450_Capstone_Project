'use client'
let instance : csvQuery;

class csvQuery {
  private datasets : any;

  constructor() {
    console.log("started");
    //making this a singleton class
    if(instance) {
      return instance;
    }
    instance = this;    

    this.datasets = new Map();

    this.fetchDatasetNames().then(data => {
      data.forEach((file: any) => {
        this.fetchDatasets(file);
      });
    }).catch(err => {
      console.log(err);
    });

    console.log(this.datasets, "test");
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

  public getDatasetsNames(): string[] {
    return Array.from(this.datasets.keys());
  }
  public getQuestions(dataset: string): {key : string, value : string}[] {
    return [...this.getIndependentQuestions(dataset), ...this.getDependentQuestions(dataset)];
  }

  public getIndependentQuestions(dataset: string): {key : string, value : any}[] {
    let out: {key : string, value : string}[] = [];
    for(let [key, value] of Object.entries(this.datasets.get(dataset).mapping.independent)) {
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
  public test(dataset: string) {
    return this.datasets.get(dataset).mapping.dependent;
  }
  public getDependentQuestions(dataset: string) : {key : string, value : string}[] {
    let out: {key : string, value : string}[] = [];
    for(let [key, value] of Object.entries(this.datasets.get(dataset).mapping.dependent)) {
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
  
}

export default csvQuery;