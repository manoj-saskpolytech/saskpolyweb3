import { IDocument } from "../../../models/IDocument";
import { DocumentService } from "../../../services/Business/DocumentService";

export const validateSignIn = (values: IDocument,showDialogForOTPGenerate,showDialogForForgetPass) => {
  let errors: any = {};
  const generateLocalizationMsg = (Key: string, defaulValue: string) => {
    return DocumentService.getLocValueByKey(Key, defaulValue)
}
  const email = values.Account_Email || "";
  const Email_ForgetPass = values.Account_Email_ForgetPass || "";
  const password = values.Account_Password_newPassword || "";
  const OTP = values.Account_OTP || "";

 if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.Account_Email = generateLocalizationMsg("valid_email","Enter a valid email ID");
  }

  if(!showDialogForOTPGenerate){
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(Email_ForgetPass)) {
      errors.Account_Email_ForgetPass = generateLocalizationMsg("valid_email","Enter a valid email ID");
    }
  }
if(!showDialogForForgetPass){
  if (password === "") {
    errors.Account_Password_newPassword =generateLocalizationMsg("password_required","Password is required");
  } else if (
    !/(?=.*[A-Z])/.test(password) || // at least one uppercase letter
    !/(?=.*[a-z])/.test(password) || // at least one lowercase letter
    !/(?=.*[0-9])/.test(password) || // at least one number
    !/(?=.*[!@#$%^&*])/.test(password) || // at least one special character
    password.length < 8 // at least 8 characters long
  ) {
    errors.Account_Password_newPassword = generateLocalizationMsg("password_requirement","Password must be at least 8 characters long and co…wercase letter, a number, and a special character");
  }
  if(OTP === ""){
    errors.Account_OTP = generateLocalizationMsg("Otp_empty_required","OTP is required");
  }
}
  

  return errors;
}
