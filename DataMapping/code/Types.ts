//parameters file
export type paramters = {
  independentVariables : String[];
  metadata : String[];
  variablesToIgnore : String[];
};

//mapping file
export type Mapping = {
  dependent : AllQuestionTypes;
  independent : AllQuestionTypes;
};

export type AllQuestionTypes =   {
  [key: string]: MC | TE | Matrix | Slider
};

type Question = {
    type: "MC" | "TE" | "Matrix" | "Slider";//types in the paramter file
    mainQuestion: String;
    answersMapping: any;
};

export interface MC extends Question{
  type: "MC";
}

export interface TE extends Question{
  type: "TE";
}

export interface Matrix extends Question {
  type: "Matrix";
  answersMapping: any;
  subQuestion: String;
}

export interface Slider extends Question {
  type: "Slider";
  answersMapping: any;
  labels: any;
}

//dataset file
export type Dataset = {
  data: String[][];
  errors: any[];
  meta: any;
};

export type FileStruct = {
  name : String;
  date: number;
};
