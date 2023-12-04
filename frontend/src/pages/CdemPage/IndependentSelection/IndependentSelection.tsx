import { useState } from "react";
import {
  InputLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import {
  IndependentSelectionProps,
  IndependentVariableSelection,
} from "../interface";

import "./index.scss";

const IndependentSelection = ({
  independentQuestions,
  answerKey,
}: IndependentSelectionProps) => {
  const [inputSelections, setInputSelections] =
    useState<IndependentVariableSelection>({
      dc22_age_in_years: "",
      dc22_genderid: "",
      dc22_province: "",
      dc22_education: "",
      dc22_canada_born: "",
    });

  const ageTextFieldProps = {
    size: "small",
  };

  const handleInputSelections = (key: string, value: string) => {
    setInputSelections({ ...inputSelections, [key]: value });
  };

  return (
    <div id="independent_selection">
      <div className="input_label">
        <InputLabel htmlFor="input_age" size="small">
          {independentQuestions?.[0]?.value}
        </InputLabel>
        <TextField
          id="input_age"
          type="number"
          inputProps={ageTextFieldProps}
          onChange={(e) => {
            setInputSelections({
              ...inputSelections,
              dc22_age_in_years: e.target.value,
            });
          }}
        />
      </div>
      {Object.entries(answerKey).map(([key, value], index) => {
        return (
          <div className="input_label">
            <InputLabel id="demo-simple-select-label">
              {independentQuestions?.[index + 1]?.value}
            </InputLabel>
            <FormControl fullWidth>
              <Select
                labelId={key}
                id={key}
                value={inputSelections?.[key as keyof IndependentVariableSelection]}
                label={key}
                onChange={(e) => {
                  handleInputSelections(key, e.target.value.toString());
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
