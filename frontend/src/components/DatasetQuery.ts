import FileFetcher from "./FileFetcher";

let instance : DatasetQuery;

class DatasetQuery {
  private fileFetcher: FileFetcher = new FileFetcher();

  //all functions are async and return a promise
  
  constructor() {
    //making this a singleton class
    if(instance) {
      return instance;
    }
    instance = this;
  }

  public async init() {
    this.fileFetcher.init();
  }


}

export default DatasetQuery;