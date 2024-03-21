//parameters file
export type paramters = {
  independentVariables : string[];
  metadata : string[];
  variablesToIgnore : string[];
  surveyYear: number;
  variableForAgeBrackets: string[];
  "AskingForBirthYearNotAge?": boolean[];
  DisplayBirthYearsNotAge : boolean;
  maxBirthYear: number;
  ageBrackets: AgeBracket[];
};

export type AgeBracket = {
  minBirthYear: number;
  bracketName: string;
};


//mapping file
export type Mapping = {
  dependent : AllQuestionTypes;
  independent : AllQuestionTypes;
};

export type AllQuestionTypes =   {
  [key: string]: MC | TE | Matrix | Slider
};

export type answersMapping =   {
  [key: string]: {Display: string}
};

type Question = {
    type: "MC" | "TE" | "Matrix" | "Slider";//types in the paramter file
    mainQuestion: string;
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
}

export interface Slider extends Question {
  type: "Slider";
}


//dataset file
export type Dataset = {
  data: string[][];
  errors: any[];
  meta: any;
};

export type FileStruct = {
  name : string;
  date: number;
};
