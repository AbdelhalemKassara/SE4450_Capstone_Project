
let instance : csvQuery;

class csvQuery {
  private datasets : any;
  private Papa = require("papaparse");

  constructor() {
    //making this a singleton class
    if(instance) {
      return instance;
    }
    instance = this;    

    this.datasets = new Map();

    this.fetchDatasetNames().then(data => {
      data.forEach(file => {
        this.fetchDatasets(file);
      });
    }).catch(err => {
      console.log(err);
    });

    console.log(this.datasets);
  }

  private async fetchDatasetNames() {
    let data = await fetch('datasets/fileNames.json');
    data = await data.json();
    
    //checks if data is an array and if all elements are a string
    if(Array.isArray(data) && data.reduce((acc, cur) => acc && typeof cur === "string", 1)) {
      return data;
    } else {
      throw Error("The dataset names json file is invalid.")
    }
  }

  //the parsing should probably use web workers and have it fetch and parse at the same time (this is already built in to papaparse)
  //also when doing this make sure to prevent the query methods from running (since the data won't be ready yet).
  //converting to json ahead of time and using gzip results in a file that 3.74x as large (for our largest file), where getting all 4 files at the same time would take nearly 12 minutes (Fast 3G) (currently it takes around 3.1min)
  private async fetchDatasets(fileName : string) {    
    let response = await fetch("datasets/" + fileName);
    let data = await response.text();

    let output = this.Papa.parse(data, {header : true});//in data object there is a 2d array [response n] [question ID]
    this.datasets.set(fileName, output);
  }

  
}

export default csvQuery;