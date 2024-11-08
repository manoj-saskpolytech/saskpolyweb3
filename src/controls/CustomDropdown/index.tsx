import * as React from "react";
import { Select, MenuItem, FormControl, SelectChangeEvent } from "@mui/material";
import { ICustomDropdownProps } from "./ICustomDropdownProps";
import * as _ from 'lodash';

const CustomDropdown: React.FC<ICustomDropdownProps> = (props) => {
  const { id, placeholder, options, formik, changeHandler, multiSelect, defaultSelectedKey, toolTipWidth, readOnly, menuProps, selectSx, ...otherprop } = props;

  const handleSingleDropdownChange = (
    event: SelectChangeEvent<string>
  ) => {
    formik.setFieldValue(id, event.target.value as string);
  };

  const handleMultipleDropdownChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    const value = event.target.value as string[];
    formik.setFieldValue(id, _.sortBy(value));
  };


  return (
    // <Tooltip title={getMultiselectValue()} placement="top" style={{ width: toolTipWidth ? "15%" : "61%" }}>
      <FormControl fullWidth variant="outlined">
        <Select
          id={id}
          multiple={multiSelect}
          defaultValue={defaultSelectedKey}
          value={formik.values[id] || defaultSelectedKey}
          onChange={(event, child) => {
            if (changeHandler) {
              changeHandler(event);
            } else if (multiSelect) {
              handleMultipleDropdownChange(event);
            } else {
              handleSingleDropdownChange(event);
            }
          }}
          label={placeholder}
          sx={selectSx}
          MenuProps={menuProps}
          {...otherprop}
        >
          {options.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              {option.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    // </Tooltip> 
  );
};

export default CustomDropdown;
