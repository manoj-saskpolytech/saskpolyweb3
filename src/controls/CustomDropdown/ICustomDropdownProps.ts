import { SelectChangeEvent } from "@mui/material";

export interface ICustomDropdownProps {
  id: string;
  placeholder?: string;
  options: { key: string; text: string }[];
  formik: any;
  multiSelect?: boolean;
  toolTipWidth?: boolean;
  readOnly?: boolean;
  defaultSelectedKey?: string;
  changeHandler?: (event: SelectChangeEvent<string | string[]>) => void;
  menuProps?: object;
  selectSx?: object;
}
