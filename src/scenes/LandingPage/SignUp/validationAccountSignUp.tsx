import { IDocument } from "../../../models/IDocument";
import { DocumentService } from "../../../services/Business/DocumentService";

export const validateSigUp = (values: IDocument, showDialogForOTP: boolean) => {
  let errors: any = {};
  const generateLocalizationMsg = (Key: string, defaulValue: string) => {
    return DocumentService.getLocValueByKey(Key, defaulValue)
}
  const firstName = values.Account_First_Name || "";
  const lastName = values.Account_Last_Name || "";
  const userName = values.Account_User_Name || "";
  const email = values.Account_Email || "";
  const password = values.Account_Password || "";
  const termsAndConditions = values.Account_Terms_And_Condition ?? false;
  const otp = values.Account_OTP || "";

  if (firstName === "") {
    errors.Account_First_Name = generateLocalizationMsg("firstname_required","First Name is required");
  } else if (firstName.length < 2 || firstName.length > 20 || !/^[A-Za-z0-9]*$/.test(firstName) ) {
    errors.Account_First_Name = generateLocalizationMsg("firstnameFormat_required","First Name must be at least 2 characters in length and should not exceed 20 characters and can contain a mix of Alphabets and Numbers Should not contain any special characters");
  }

  if (lastName === "") {
    errors.Account_Last_Name = generateLocalizationMsg("lastname_required","Last Name is required");
  } else if (lastName.length < 2 || lastName.length > 20 || !/^[A-Za-z0-9]*$/.test(lastName) ) {
    errors.Account_Last_Name = generateLocalizationMsg("lastnameFormat_required","Last Name must be at least 2 characters in length and should not exceed 20 characters and can contain a mix of Alphabets and Numbers Should not contain any special characters");
  }

  if (userName === "") {
    errors.Account_User_Name = generateLocalizationMsg("username_required","User Name is required");
  } else if (userName.length < 2 || userName.length > 15 || !/^[A-Za-z0-9]*$/.test(firstName) ) {
    errors.Account_First_Name = generateLocalizationMsg("usernameFormat_required","User Name must be atleast 2 characters in length and should not exceed 15 characters and can contain a mix of Alphabets and Numbers Should not contain any special characters");
  }

  if (email === "") {
    errors.Account_Email = generateLocalizationMsg("emailid_required","Email ID is required");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.Account_Email = generateLocalizationMsg("valid_email","Enter a valid email ID");
  }

  if (password === "") {
    errors.Account_Password = generateLocalizationMsg("password_required","Password is required");
  } else if (
    !/(?=.*[A-Z])/.test(password) || // at least one uppercase letter
    !/(?=.*[a-z])/.test(password) || // at least one lowercase letter
    !/(?=.*[0-9])/.test(password) || // at least one number
    !/(?=.*[!@#$%^&*])/.test(password) || // at least one special character
    password.length < 8 // at least 8 characters long
  ) {
    errors.Account_Password = generateLocalizationMsg("password_requirement","Password must be at least 8 characters long and co…wercase letter, a number, and a special character");
  }

  if (!termsAndConditions) {
    errors.Account_Terms_And_Condition = generateLocalizationMsg("terms_and_condition_required","You must accept the terms and conditions");
  }

  if (!showDialogForOTP) {
    if (otp === "") {
      errors.Account_OTP = generateLocalizationMsg("otp_required","OTP is required to confirm the Sign Up");
    }
  }

  return errors;
};
