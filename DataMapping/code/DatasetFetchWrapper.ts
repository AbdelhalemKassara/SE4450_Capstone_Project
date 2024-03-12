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

}