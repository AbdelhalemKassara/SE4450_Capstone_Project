import { MappingFileName, DatasetName, Dataset, QuestionText } from "./NewTypes";
let instance : FileFetcher;
import { FileStruct, Mapping, AllQuestionTypes, MC, TE, Matrix, Slider } from "../../../DataMapping/code/Types";
 
class FileFetcher {
  //note none of the ids have a .json or any file ending
  private mappingsPromise: Map<DatasetName, Promise<Mapping>> = new Map<DatasetName, Promise<Mapping>>();// key is dataset year
  private datasetsPromise: Map<DatasetName, Dataset> = new Map();//key is dataset year, string[column][row]
  
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

    //this should use the fetchJsonFileWithCache function once it is implemented
    this.getMappingFiles();

  }
  
  
  /*fuctions to get the various ids */
  public async getDatasetsIds(): Promise<string[]> {
    let datasetIds: string[] = [];

    (await this.datasetIdsPromise).forEach((val: FileStruct) => {
      datasetIds.push(val.name);
    })
    return datasetIds;
  }

  public async getIndependentVarsIds(datasetId: string): Promise<string[]> {
    return this.getVarsIds(datasetId, "independent");
  }

  public async getDependentVarsIds(datsetId: string): Promise<string[]> {
    return this.getVarsIds(datsetId, "dependent");
  }
  
  public async getAllVarIds(datasetId: string): Promise<string[]> {
    let independent: string[] = await this.getIndependentVarsIds(datasetId);
    let dependent: string[] = await this.getDependentVarsIds(datasetId);

    return [...independent, ...dependent];
  }


  /*functions to get stuff from the mapping file */
  public async getQuestionText(datasetId: string, colId: string): Promise<string> {
    let answerMap: (MC | TE | Matrix | Slider) = await this.getAnswerMappingObj(datasetId, colId);
    return answerMap.mainQuestion;
  }

  public async getType(datasetId: string, colId: string): Promise<string> {
    let answerMap: (MC | TE | Matrix | Slider) = await this.getAnswerMappingObj(datasetId, colId);
    return answerMap.type;
  }


  /*functions to get data from the dataset */
  public async getColsVals(datasetId: string, colId: string): Promise<string[]> {
    let rawColValues: string[] = await this.getRawColVals(datasetId, colId);
    let answerMap: Map<string, string> = await this.getAnswerMapping(datasetId, colId);

    let output: string[] = [];
    
    rawColValues.forEach((answerId: string) => {
      let answer = answerMap.get(answerId);
      if(answer) {
        output.push(answer);
      } else if(answerId === "-99" || answerId === undefined || answerId === null || answerId === "NA" || answerId === '') {
        //this means there was no response  
      } else {
        throw new Error(`We couldn't find the mapping for datasetId ${datasetId} colId ${colId} and answerId ${answerId}.`);
      }
    });
    
    return output;
  }

  //this doesn't change the array length so we can compare two differnt columns together
  public async getColValsFullList(datasetId: string, colId: string): Promise<(undefined | string)[]> {
    let rawColValues: string[] = await this.getRawColVals(datasetId, colId);
    let answerMap: Map<string, string> = await this.getAnswerMapping(datasetId, colId);

    let output: (undefined | string)[] = [];

    rawColValues.forEach((answerId: string) => {
      let answer = answerMap.get(answerId);
      if(answer) {
        output.push(answer);
      } else if(answerId === "-99" || answerId === undefined || answerId === null || answerId === "NA") {
        output.push(undefined);
      } else {
        throw new Error(`We couldn't find the mapping for datasetId ${datasetId} colId ${colId} and answerId ${answerId}.`);
      }
    });
    
    return output;
  }

  public async getFeduid(datasetId: string): Promise<string[]> {
    return this.getRawColVals(datasetId, "feduid");
  }

  public async getAnswerIds(datasetid: string, colId: string): Promise<Map<QuestionText, number>> {
    let question: MC | TE | Matrix | Slider = await this.getAnswerMappingObj(datasetid, colId);
    let out: Map<QuestionText, number> = new Map<QuestionText, number>();

    for(let [key, value] of Object.entries(question.answersMapping)) {
      //@ts-ignore: value.Display will always be defined
      out.set(value.Display, key);
    }

    return out;
  }
  
  public async getJSONPolygonFile(fileName: string): Promise<any> {
    return this.fetchJsonFile<any>(`${fileName}.json`);
  }


  /*private functions*/

  //this gets the answer mapping from the mapping file
  private async getAnswerMappingObj(datasetId: string, colId: string): Promise<MC | TE | Matrix | Slider> {
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
  private async getAnswerMapping(datasetId: string, colId: string): Promise<Map<string, string>> {
    let map: Map<string, string> = new Map<string, string>();
    let answerMapObj: MC | TE | Matrix | Slider = await this.getAnswerMappingObj(datasetId, colId);

    for(let [key, value] of Object.entries(answerMapObj.answersMapping)) {
      //@ts-expect-error: This is mostly because we can't assing a type in this kind of loop
      if(value?.Display || value?.Display === '') {
        //@ts-expect-error: same as above 
        map.set(key, value.Display);
      } else {
        throw new Error(`The column Id ${colId} from the Dataset with Id ${datasetId}, doesn't have a .Display property in the answerMapping property.`);
      }
    }

    return map;
  }

  //fetches the column values
  private async getRawColVals(datasetId: string, colId: string): Promise<string[]> {
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
        let data: Promise<string[]> = this.fetchJsonFile<string[]>(datasetId + "/" + colId + ".json");

        datasetMap = datasetMap.set(colId, data);
        return this.getColValueFromDatasetMap(colId, datasetMap);
      }
    } else {
      throw new Error("This datasetId doesn't exist.");
    }

  }

  //helper function for getRawColVals
  private async getColValueFromDatasetMap(colId: string, datasetMap: Dataset): Promise<string[]>  {
    let colvals: string[] | undefined = await datasetMap.get(colId);
    if(colvals) {
      let vals: string[] = [...colvals];

      vals.shift();
      return vals;
    } else {
      throw new Error("The columns string[] is undefined for some reason.");
    }
  }

  private async getVarsIds(datasetId: string, type: "independent" | "dependent"): Promise<string[]> {
    if(this.mappingsPromise.has(datasetId)) {
      let Questions: AllQuestionTypes | undefined = (await this.mappingsPromise.get(datasetId))?.[type];
      
      let questionIds: string[] = [];
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
      this.datasetsPromise.set(val.name, new Map<string, Promise<string[]>>());
    });    
  }

  private async getMappingFiles() {
    //datasetId/datasetId-mapping.json
    (await this.datasetIdsPromise).forEach((val: FileStruct) => {
      this.mappingsPromise.set(val.name, this.fetchJsonFile<Mapping>(val.name + "/" + val.name + "-mapping.json"));
    });
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
