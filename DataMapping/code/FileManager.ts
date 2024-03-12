import { dir } from 'console';
import {PathLike, readdirSync, readFileSync, write, writeFileSync, mkdirSync} from 'fs';
import Papa from 'papaparse';
import path from "path";


export class FileManager {
  private outputFilesDir: string = "outputFiles";

  public getCSVFile(path: PathLike): any {
    return Papa.parse(this.readFile(path));
  }

  public getJSONFile(path: PathLike): any {
    return JSON.parse(this.readFile(path));
  }

  public getDirectories(source: PathLike): string[] {
    return readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
  }

  public getQsfFileNameInDir(source: PathLike): string {
    return this.getAFileTypesPaths(source, "qsf");
  }
  
  public getCsvFileNameInDir(source: PathLike): string {
    return this.getAFileTypesPaths(source, "csv");
  }
  public getParamtersFileNameInDir(source: PathLike): string {
    return this.getAFileTypesPaths(source, "json");
  }

  public writeFile(json: any, filePath: string[], file: string) {
    this.makeDirectory(filePath);
    writeFileSync(path.join(this.outputFilesDir, ...filePath, file), JSON.stringify(json));
  }

  private makeDirectory(dirPath: string[]) {
    mkdirSync(path.join(this.outputFilesDir, ...dirPath));
  }
  //private functions
  private readFile(path: PathLike) {
    return readFileSync(path).toString();
  }

  //the type parameter needs to be lowercase
  private getAFileTypesPaths(source: PathLike, type: String): string {
    return readdirSync(source, { withFileTypes: true })
            
            .filter(dirent => dirent.isFile())
            
            .map(dirent => dirent.name).filter(file => {
              let split = file.split(".");
              return split[split.length - 1].toLowerCase() === type;
            }
          )
          .map(str => source + "/" + str)[0];
  }
 
}