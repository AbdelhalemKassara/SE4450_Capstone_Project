export interface Answers {
  Display: string;
}
export interface QuestionAnswers {
  key?: Array<string>;
}
export interface IndependentQuestions {
  key: string;
  value: string;
}

export interface IndependentSelectionProps {
    independentQuestions: Array<IndependentQuestions>;
    answerKey: QuestionAnswers;
}

export interface IndependentVariableSelection {
    dc22_age_in_years: string,
    dc22_genderid: string,
    dc22_province: string,
    dc22_education: string,
    dc22_canada_born: string;
}