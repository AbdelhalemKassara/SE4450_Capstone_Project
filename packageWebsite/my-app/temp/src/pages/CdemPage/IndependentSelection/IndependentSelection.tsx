import {
  InputLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import * as React from 'react'

import {
  IndependentSelectionProps,
  IndependentVariableSelection,
} from "../interface";

import "./index.scss";

const IndependentSelection = ({
  independentQuestions,
  answerKey,
  inputSelections,
  handleInputSelections,
}: IndependentSelectionProps) => {
  const questionMapping: IndependentVariableSelection = {
    dc22_age_in_years: "Age",
    dc22_genderid: "Gender",
    dc22_province: "Province",
    dc22_education: "Education",
    dc22_canada_born: "Canadian",
  };

  const ageTextFieldProps = {
    size: "small",
  };

  const inputSelectionsHandler = (key: string, value: string) => {
    handleInputSelections({ ...inputSelections, [key]: value });
  };

  return (
    <div id="independent_selection">
      <div className="input_label">
        <FormControl fullWidth>
          <TextField
            id="input_age"
            type="number"
            label={questionMapping?.dc22_age_in_years}
            inputProps={ageTextFieldProps}
            onChange={(e) => {
              inputSelectionsHandler(
                "dc22_age_in_years",
                e.target.value.toString()
              );
            }}
          />
        </FormControl>
      </div>
      {Object.entries(answerKey).map(([key, value]) => {
        return (
          <div className="input_label">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {questionMapping?.[key as keyof IndependentVariableSelection]}
              </InputLabel>
              <Select
                labelId={key}
                id={key}
                value={
                  inputSelections?.[key as keyof IndependentVariableSelection]
                }
                label={
                  questionMapping?.[key as keyof IndependentVariableSelection]
                }
                onChange={(e) => {
                  inputSelectionsHandler(key, e.target.value.toString());
                }}
              >
                {value.map((e: string) => (
                  <MenuItem value={e}>{e}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        );
      })}
    </div>
  );
};

export default IndependentSelection;
