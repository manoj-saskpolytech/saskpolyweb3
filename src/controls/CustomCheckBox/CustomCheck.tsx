import * as React from "react";
import { Checkbox, FormControlLabel, Stack, ThemeProvider, useTheme } from "@mui/material";
import { ICustomCheckboxProps } from "../CustomCheckBox/ICustomCheckProps";
import { generateTokens } from "../../theme";

const CustomCheckbox: React.FC<ICustomCheckboxProps> = ({
  id,
  readOnly,
  formik,
  label,
  ...otherprop
}) => {
  const theme = useTheme();
  const colors = generateTokens(theme.palette.mode);
  const onChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      formik.setFieldValue(id, checked);
    },
    [formik, id]
  );

  return (
    <ThemeProvider theme={theme}>
      <Stack direction="row" spacing={2}>
        <FormControlLabel
      sx={{
        color: "#253858",
   "& .MuiFormControlLabel-label.Mui-disabled": {
          color: "#9d9d9d", // Adjust the disabled color as needed
        },
      }}
          control={
            <Checkbox
              id={id}
              checked={formik.values[id] || false} // Ensure it is always controlled
              onChange={onChange}
              disabled={readOnly}
              sx={{
             color:"#253858",
                "&.Mui-checked": {
                  color: `${colors.blue[500]}`, // Inner selected color when checked
                },
                "&:not(.Mui-checked)": {
                  color: "whitesmoke !important", // Inner color when unchecked
                },
                "& .MuiSvgIcon-root": {
                  fontSize: 22, // Adjust icon size as needed
                  fill:"#253858"
                },
              }}
              {...otherprop}
            />
          }
          label={label}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default CustomCheckbox;
