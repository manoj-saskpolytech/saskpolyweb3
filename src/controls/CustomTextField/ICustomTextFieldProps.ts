import { BaseTextFieldProps } from "@mui/material/TextField";

export interface ICustomTextFieldProps extends BaseTextFieldProps {
  id: string;
  placeholder: string;
  formik: any;
  readOnly:boolean;
  autocomplete?:string;
  changeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  otherProps?: any;
}
