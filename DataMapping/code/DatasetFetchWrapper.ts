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

  public getQuestionIds(): String[] {
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

  public updateQuestId(oldQuestId: String, newQuestId: String) {
    for(let i = 0; i < this.dataset.data[0].length; i++) {
      if(this.dataset.data[0][i] === oldQuestId) {
        this.dataset.data[0][i] = newQuestId;
        return;
      } 
    }

    //this might be because of multiple calls for the same old question id because this function is getting called before the independet variables are removed from the dependent variables
    console.log(`Warning: there was an questionId that was called to be updated but the old id couldn't be found. (so it wasn't updated) old: ${oldQuestId} new: ${newQuestId}`);
  }

  public getDatasetWithSwappedRowAndCol(): String[][] {
    if(this.dataset.data.length === 0) {
      throw new Error("There is no dataset or the dataset wasn't loaded properly.");
    }
    
    let out: String[][] = new Array(this.dataset.data[0].length);
    
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
}