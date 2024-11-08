import * as React from "react";
import { FormHelperText, TextField } from "@mui/material";
import {ICustomTextFieldProps} from "./ICustomTextFieldProps";
import * as _ from "lodash";

const CustomTextField: React.FC<any> = (props:ICustomTextFieldProps) => {
    const { id, placeholder, formik,changeHandler,readOnly,autocomplete, ...otherprop } = props;
    let formikProps =formik.getFieldProps(id)

    if(changeHandler)
    formikProps.onChange = changeHandler;
  
    let readOnlyProps={}
    if (props.readOnly) {
      readOnlyProps = {
        title: formikProps.value,
        value: (_.isArray(formikProps.value))?_.join(formikProps.value, ", "):formikProps.value,
      };
    }

    
    return (
      <div style={{ position: 'relative',width:"100%"}}>
        <TextField
        id={id}
        {...formikProps}
        disabled={readOnly}
        className="globalTextField"
        placeholder={placeholder}
        autoComplete={autocomplete}
        variant="standard"
        InputProps={{
          style: { height: "40px",color:"#253858",backgroundColor:"#ffffff",padding:"10px",borderRadius:"5px"} // Adjust the height here
        }}
        sx={{
          '& .MuiInputBase-root.MuiInput-root::before': {
            borderRadius: "5px"
          },
          '& .MuiInputBase-root.Mui-disabled .MuiInputBase-input': {
            color: "#253858 !important",
            opacity: "1 !important",
            WebkitTextFillColor: "initial !important"
          },
          '& .MuiInputBase-root.Mui-disabled .MuiInputBase-input::placeholder': {
            color: '#253858 !important'
          }
        }}
        {...otherprop}
        {...readOnlyProps}
        />
        {formik.touched[id] && formik.errors[id] && (
        <FormHelperText
          error
          sx={{
            color: "#f44336",
            fontSize: '12px',
            marginLeft:'10px',
          }}
        >
          {formik.errors[id]}
        </FormHelperText>
      )}
      </div>
    );
    }
export default CustomTextField;
