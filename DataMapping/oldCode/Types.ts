//parameters file
export type paramters = {
  independentVariables : String[];
  metadata : String[];
  variablesToIgnore : String[];
};

//mapping file
export type Mapping = {
  dependent : {
    [key: string]: MC | TE | Matrix | Slider;
  };
  independent : {
    [key: string]: MC | TE | Matrix | Slider;
  };
};

type Question = {
    type: "MC" | "TE" | "Matrix" | "Slider";//types in the paramter file
    mainQuestion: String;
    answersMapping: any;
    labels: any;
};

interface MC extends Question{
  type: "MC";
  answersMapping: any;//this one should be answersmapping but is kinda hard to define
}
type answersMapping = {
  [key: number] : {
    [key in keyof {"Display" : any}] : String;//I did it this way so the key can be a literal of Display
  }
};

interface TE extends Question{
  type: "TE";
  uniqueAnswers: String[];
}

interface Matrix extends Question {
  type: "Matrix";
  answersMapping: any;
}

interface Slider extends Question {
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