//dc22_religion has mc then an other category which won't work here. See codebook for information how prof handeled it
//for now I'll throw it in the metadata section where it will be ignored

//the question references to a field that needs to be filled in we should ask the prof about that

//for standard mc question
//check if "survey.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for
//The question is located at "survey.SurveyElements[i].Payload.QuestionText".
//The answers are located in "survey.SurveyElements[i].Payload.Choices" in the format { "index" : { "Display" : "answer"}}
// function mc(): answer {

// }
//for "box" mc question (where there are multiple questions grouped together with same scale)
//check if "survey.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The main question is located at "survey.SurveyElements[i].Payload.QuestionText".
//for every single "question_number" just repeat the same thing for now (the answer data will be the same but the question data wil be different)
//The questions are located in "survey.SurveyElements[i].Payload.Choices.'number'" in the format where number is "question_number" in question id. ex number = "1"
//The answers are located in "survey.SurveyElements[i].Payload.Choices" in the format { "answerID" : { "Display" : "answer"}}
// function boxMc(): answer {

// }

//for standard mc question with an "Other" option (user enters text)
//same as standard mc questions for the ones that don't end in "_text" or "_TEXT"
//if it ends with "_text" or "_TEXT" gather all possible answers from dataset for this column

//for long answer questions in a box
//check if "survey.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The main question is located at "survey.SurveyElements[i].Payload.QuestionText".
//have ex. dc22_origin_N point back to dc22_origin and dc22_origin will contain all the answers (since they all share the same question and answers)
//combine all single dc22_origin_N and get the unique answers
// function boxLongAnswer(): answer {

// }
//for long answer questions
//check if "survey.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for
//The question is located at "survey.SurveyElements[i].Payload.QuestionText".
//The answers are all unique responses from the dataset for this question
// function longAnswer(): answer {

// }
//for slider questions in a box
//check if "survey.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The main question is located at "survey.SurveyElements[i].Payload.QuestionText".
//The sub questions are located in "survey.SurveyElements[i].Payload.Choices.'number'" in the format where number is "question_number" in question id. ex number = "1"
//The answers are located in "survey.SurveyElements[i].Payload.Answers" in the format { "answerID" : { "Display" : "answer"}}
// The slider range is in "survey.SurveyElements[i].Payload.Configuration.CSSliderMin" and "survey.SurveyElements[i].Payload.Configuration.CSSliderMax"
// function boxSlider(): answer {

// }
//for slider questions (same as box pretty much)
//check if "survey.SurveyElements[i].Payload.DataExportTag" exists and is a question id we are looking for. The remove the number at the end of the id and the underscore i.e. "question_323" to "question"
//The question is located at "survey.SurveyElements[i].Payload.QuestionText".
//The answers are located in "survey.SurveyElements[i].Payload.Choices" in the format { "answerID" : { "Display" : "answer"}}
// The slider range is in "survey.SurveyElements[i].Payload.Configuration.CSSliderMin" and "survey.SurveyElements[i].Payload.Configuration.CSSliderMax"

// function slider(): answer {

// }

//for dealing with box
//The main question is located at "survey.SurveyElements[i].Payload.QuestionText".
//The sub questions are located in "survey.SurveyElements[i].Payload.Choices.'number'" in the format where number is "question_number" in question id. ex number = "1"
//The answers are located in "survey.SurveyElements[i].Payload.Answers" in the format { "answerID" : { "Display" : "answer"}}
// function box(): answer {
 
// }