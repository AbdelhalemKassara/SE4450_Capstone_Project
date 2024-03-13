import { MappingFileName, DatasetName, Dataset } from "./NewTypes";
let instance : FileFetcher;
import { FileStruct, Mapping, AllQuestionTypes, MC, TE, Matrix, Slider } from "../../../DataMapping/code/Types";

class FileFetcher {
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

  //note none of the ids have a .json or any file ending
  private mappingsPromise: Map<DatasetName, Promise<Mapping>> = new Map<MappingFileName, Promise<Mapping>>();// key is dataset year
  private datasetsPromise: Map<DatasetName, Dataset> = new Map();//key is dataset year, String[column][row]
  
  private datasetIdsPromise !: Promise<FileStruct[]>;
  private datasetFileNamesPromise : Map<DatasetName, Promise<FileStruct[]>> = new Map<DatasetName, Promise<FileStruct[]>>();

  constructor() {
    //making this a singleton class
    if(instance) {
      return instance;
    }
    instance = this;
  }

  public async init() {
    await this.getDatasetIds();
    //after we get the datasetIds get the datasetId-mapping and the datasetFileNames
    await this.getDatasetFileNames();
    await this.validateCache();//this will remove outdated mapping files from the database

    //this should use the fetchJsonFileWithCache function once it is implemented
    this.getMappingFiles();

  }
  
  
  /*fuctions to get the various ids */
  public async getDatasetsIds(): Promise<String[]> {
    let datasetIds: String[] = [];


    (await this.datasetIdsPromise).forEach((val: FileStruct) => {
      datasetIds.push(val.name);
    })
    return datasetIds;
  }

  public async getIndependentVarsIds(datasetId: String): Promise<String[]> {
    return this.getVarsIds(datasetId, "independent");
  }

  public async getDependentVarsIds(datsetId: String): Promise<String[]> {
    return this.getVarsIds(datsetId, "dependent");
  }
  
  public async getAllVarIds(datasetId: String): Promise<String[]> {
    let independent: String[] = await this.getIndependentVarsIds(datasetId);
    let dependent: String[] = await this.getDependentVarsIds(datasetId);

    return [...independent, ...dependent];
  }


  /*functions to get stuff from the mapping file */
  

  /*functions to get data from the dataset */
  //null means no response
  public async getColsVals(datasetId: String, colId: String): Promise<String[]> {
    let rawColValues: String[] = await this.getRawColVals(datasetId, colId);
    let answerMap: Map<String, String> = await this.getAnswerMapping(datasetId, colId);

    let output: String[] = [];

    rawColValues.forEach((answerId: String) => {
      let answer = answerMap.get(answerId);
      if(answer) {
        output.push(answer);
      } else if(answerId === "-99") {
        //this means there was no response  
      } else {
        throw new Error(`We couldn't find the mapping for datasetId ${datasetId} colId ${colId} and answerId ${answerId}.`);
      }
    });


    return output;
  }



  /*private functions*/

  //this gets the answer mapping from the mapping file
  private async getAnswerMappingObj(datasetId: String, colId: String): Promise<MC | TE | Matrix | Slider> {
    let questionsMap: Mapping | undefined = await this.mappingsPromise.get(datasetId);
    if(questionsMap) {
      let question: MC | TE | Matrix | Slider | undefined = undefined;
      for(let [key, value] of Object.entries(questionsMap.independent)) {
        if(key === colId) {
          question = value;
          break;
        }
      }
      if(!question) {
        for(let [key, value] of Object.entries(questionsMap.dependent)) {
          if(key === colId) {
            question = value;
            break;
          }
        }
      }

      if(!question) {
        throw new Error(`We weren't able to find ${colId} in the mapping file.`);
      }

      return question;
    } else {
      throw new Error(`The datasetId "${datasetId}"'s mapping file doesn't exist.`);
    }
  }

  //this gets the answer mapping in the form of a hashmap in the mapping file
  private async getAnswerMapping(datasetId: String, colId: String): Promise<Map<String, String>> {
    let map: Map<String, String> = new Map<String, String>();
    let answerMapObj: MC | TE | Matrix | Slider = await this.getAnswerMappingObj(datasetId, colId);
    console.log(answerMapObj);
    for(let [key, value] of Object.entries(answerMapObj.answersMapping)) {
      //@ts-expect-error: This is mostly because we can't assing a type in this kind of loop
      if(value?.Display) {
        //@ts-expect-error: same as above 
        map.set(key, value.Display);
      } else {
        throw new Error(`The column Id ${colId} from the Dataset with Id ${datasetId}, doesn't have a .Display property in the answerMapping property.`);
      }
    }

    return map;
  }

  //fetches the column values
  private async getRawColVals(datasetId: String, colId: String): Promise<String[]> {
    let datasetMapTemp: Dataset | undefined;
    let datasetMap: Dataset;
    if(this.datasetsPromise.has(datasetId)) {
      datasetMapTemp = this.datasetsPromise.get(datasetId);
    } else {
      throw new Error("This datasetId doesn't exist.");
    }

    if(datasetMapTemp) {
      datasetMap = datasetMapTemp;

      if(datasetMap.has(colId)) {
        return this.getColValueFromDatasetMap(colId, datasetMap);
      } else {
        //fetch the file
        let data: Promise<String[]> = this.fetchJsonFile<String[]>(datasetId + "/" + colId + ".json");

        datasetMap = datasetMap.set(colId, data);
        return this.getColValueFromDatasetMap(colId, datasetMap);
      }
    } else {
      throw new Error("This datasetId doesn't exist.");
    }

  }

  //helper function for getRawColVals
  private async getColValueFromDatasetMap(colId: String, datasetMap: Dataset): Promise<String[]>  {
    let colvals: String[] | undefined = await datasetMap.get(colId);
    if(colvals) {
      let vals: String[] = [...colvals];

      vals.shift();
      return vals;
    } else {
      throw new Error("The columns String[] is undefined for some reason.");
    }
  }

  private async getVarsIds(datasetId: String, type: "independent" | "dependent"): Promise<String[]> {
    if(this.mappingsPromise.has(datasetId)) {
      let Questions: AllQuestionTypes | undefined = (await this.mappingsPromise.get(datasetId))?.[type];
      
      let questionIds: String[] = [];
      if(Questions) {
        for(let [key] of Object.entries(Questions)) {
          questionIds.push(key);
        }
        
        return questionIds;
      }
    } 
    
    throw new Error("Error: The datasetId passed in to the getIndependentVarsIds or getDependentVarsIds function is invalid");
  }
  
  private async getDatasetIds() {
    //fetch the datasetIds
    //dirNames.json contains the dataset Ids
    this.datasetIdsPromise = this.fetchJsonFile<FileStruct[]>("dirNames.json");
  }

  private async getDatasetFileNames() {
    //datasetId/datasetFileNames.json
    (await this.datasetIdsPromise).forEach((val: FileStruct) => {
      this.datasetFileNamesPromise.set(val.name, this.fetchJsonFile<FileStruct[]>(val.name + "/" + "datasetFileNames.json"));
      this.datasetsPromise.set(val.name, new Map<String, Promise<String[]>>());
    });    
  }

  private async getMappingFiles() {
    //datasetId/datasetId-mapping.json
    (await this.datasetIdsPromise).forEach((val: FileStruct) => {
      this.mappingsPromise.set(val.name, this.fetchJsonFile<Mapping>(val.name + "/" + val.name + "-mapping.json"));
    });
  }

  private async validateCache() {

  }

  private fetchJsonFileWithCache(promise: Promise<any>, value: any, path: string) {
    //first check the dirNames.json for the time (and if there are any datsets removed), and if that time is different than the locally stored version.
    //for now use this info only to check if a year needs to be removed or added

    //then check the the locally stored datasetFileNames.json for the times and compare it with the new one that has been fetched (includes the datasetId-mapping.json) and remove the datasets that aren't valid anymore.
    
  } 

  private fetchJsonFile<T>(url: string): Promise <T> {
    return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>
    })
  }
}

export default FileFetcher;
