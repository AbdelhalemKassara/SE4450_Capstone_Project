import Papa, {ParseResult} from 'papaparse';
import fs, {PathLike} from 'fs';


export class DatasetFetchWrapper {
  //this class should contain the dataset
  //contains a bunch of functions with descriptive names on what they are fetching.
  private dataset: ParseResult<any>;

  constructor(csvFilePath: PathLike) {
    //maybe switch from [row][column] to [column][row] as I can break up the file to what we need.
    this.dataset = Papa.parse(fs.readFileSync(csvFilePath).toString());
  }

  public getQuestionIds(): string[] {
    return this.dataset.data[0];
  }

  public getValue(row: Number, column: Number) {
    /*
      for some reason even if we pass {header: false} (where if it's true it will return a object with an array inside it) 
      in the Papa.parse function call it still thinks an object is possible
    */
    //@ts-ignore; 
    return this.dataset.data[row][column];
  }

  public getRowLength() {
    return this.dataset.data.length;
  }

  public getColumnLength() {
    return this.dataset.data[0].length;
  }

  public updateQuestId(oldQuestId: string, newQuestId: string) {
    for(let i = 0; i < this.dataset.data[0].length; i++) {
      if(this.dataset.data[0][i] === oldQuestId) {
        this.dataset.data[0][i] = newQuestId;
        return;
      } 
    }

    //this might be because of multiple calls for the same old question id because this function is getting called before the independet variables are removed from the dependent variables
    console.log(`Warning: there was an questionId that was called to be updated but the old id couldn't be found. (so it wasn't updated) old: ${oldQuestId} new: ${newQuestId}`);
  }

  public updateQuestValues(questionId: string, OldNewValMap: Map<string, string>): void {
    let columnIndex: number = this.getDatasetColumnIndex(questionId); 
    
    //1 so we skip the id
    for(let i = 1; i < this.dataset.data.length; i++) {
      let val: string | undefined = OldNewValMap.get(this.dataset.data[i][columnIndex]);
      if(val) {
        this.dataset.data[i][columnIndex] = val;
      } else {
        throw new Error(`There was an issue with updating the values for questionid ${questionId}, the mapping file can't find ${this.dataset.data[i][columnIndex]}.`);
      }
    }
  }
  public getDatasetWithSwappedRowAndCol(): string[][] {
    if(this.dataset.data.length === 0) {
      throw new Error("There is no dataset or the dataset wasn't loaded properly.");
    }
    
    let out: string[][] = new Array(this.dataset.data[0].length);
    
    for(let i = 0; i < out.length; i++) {
      out[i] = new Array(this.dataset.data.length);
    }

    for(let i = 0; i < this.dataset.data.length; i++) {
      for(let d = 0; d < this.dataset.data[i].length; d++) {
        out[d][i] = this.dataset.data[i][d];
      }
    }

    return out;
  }

  public getDatasetColumnIndex(questionId: string) : number {
    let columnIndex: number = -1; 
    for(let i = 0; i < this.dataset.data[0].length; i++) {
      if(this.dataset.data[0][i] === questionId) {
        columnIndex = i;
        break;
      } 
    }
    
    if(columnIndex !== -1) {
      return columnIndex;
    } else {
      throw new Error(`We couldn't find the column Index for ${questionId}.`);
    }
  }

  public getDatasetColumn(questionId: string) : string[] {
    let columnIndex: number = this.getDatasetColumnIndex(questionId);

    let out: string[] = [];

    this.dataset.data.forEach((row: string[]) => {
      out.push(row[columnIndex]);
    });

    return out;
  }
}

