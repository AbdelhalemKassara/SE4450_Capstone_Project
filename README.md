# SE4450_Capstone_Project
## Info About Certian Parts of The Code
### DataMapping
#### paramters.json
The structure of the file is here:
```typescript
export type paramters = {
  independentVariables : string[];
  metadata : string[];
  variablesToIgnore : string[];
  
  surveyYear: number;
  variableForAgeBrackets: string;
  "AskingForBirthYearNotAge?": boolean;
  DisplayBirthYearsNotAge : boolean;
  
  maxBirthYear: number;
  ageBrackets: {
    minBirthYear: number;
    bracketName: string;
  }[];
};
```
- The strings in the independentVariables, metadata, variablesToIgnore, and variableForAgeBrackets are the question ids found in the top row of the .csv file.
- By default all the variables are dependent variables, so in order to have independent variables you would need to add their ids to the independentVariable paramter.
- The variablesToIgnore is just an array of question ids that won't be added to the mapping file.
- We didn't find any use of the metadata so currently anything in this list is being removed (i.e. it's not added to the mapping file). 
- The surveyYear, variableForAgeBrackets, "AskingForBirthyearNotAge?", DisplayBirthYearsNotAge, maxBirthYear, and ageBrackets are all for condensing the question asking for the participants age or birth year.
- The "AskingForBirthyearNotAge?" indicates if the birth years or the ages are being stored in the .csv file.
- The maxBirthYear is the upper range of the youngest age bracket.
- The bracketName is there if you want to attach a custom label to the bracket for example "Baby Boomer" or "Gen Z".
- The DisplayBirthYearsNotAge is for controlling if you want to display the birth year or the age range for the labels that will be displayed.
- The format of the lables is "bracketName (lowerBirthYear - upperBirthYear)" or "bracketName (lowerAge - upperAge)" where upperAge and upperBirthYear are the minBirthYear of the next bracket minus 1, or the maxBirthYear minus 1.


### Mapping File

## Deployment Instructions
There are three main stages for deployment, the first is converting the .dta file to .csv, the second is creating the mapping file and creating the mapping file/breaking up the datset by columns (to improve loading times), and the final stage is building the frontend.

### Converting the .dta file to .csv
This is necessary as exporting the data from Qualtrics writes the actual reponses to the .csv file rather than the ids in the .qsf file.
#### Prerequisites
- Rscript 
  - On linux you can install it with `apt install r-base-core`.
- Rscript haven package 
  - The first line in the script should install that for you, just remember to comment that out after the first time you run it.

#### Execution
1. Navigate to the miscCode folder.
2. Edit the paths in convertDtaFileToCsv.r to the one for where the .dta file and wherver you want to write the .csv file.
3. Run the script using `Rscript convertDtaFileToCsv.r`.
4. Repeat this for all the .dta files.


### Creating the mapping and dataset files
#### Prerequisites
- node
  - It can be installed on linux with `apt install nodejs`. 
- npm
  - It should be already installed if you installed node.

### Execution
1. Navigate to the dataMapping folder.
2. In the inputFiles folder create folders for each dataset(make sure the folder names are unique) and place a .qsf, .csv and paramters.json file.
3. Install all the dependencies with `npm ci`.
4. Run the code with `npm run start`.
5. In frontend/public delete any folders there if they exist and the dirNames.json file.
6. You will see a folder that has been created called outputFiles, copy all the files in this folder(not the folder itself) and paste them all in the public folder in frontend/public.


### Building The Frontend
### Prerequisites
- node
  - It can be installed on linux with `apt install nodejs`. 
- npm
  - It should be already installed if you installed node.

### Execution
1. Navigate to the frontend folder.
2. Install all dependencies with `npm ci`.
3. Build the frontend with `npm run buildNoTsc`.
