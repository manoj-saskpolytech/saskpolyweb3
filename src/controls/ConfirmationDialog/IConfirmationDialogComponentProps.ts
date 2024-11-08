export interface IConfirmationDialogComponentProps {
    title: string;
    message: string;
    hidden?: boolean;
    CloseVisibleIcon?:boolean;
    fieldHiddenForgotPass?:boolean;
    readOnly?:boolean;
    fieldHidden?:boolean;
    SubmitOnClick: () => void;
    onClose: () => void;
    oktext: string;
    closeText?: string;
    Placeholder?:string;
    id?:string;
    name?:string;
    onResendOtp?: () => void;
    formik?:any;
    disabled?:boolean;
    timerText?:number;
  }