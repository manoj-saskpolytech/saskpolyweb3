export interface IDocumentService {
  // Method to get a configuration value using the ApiService
  getConfigValue(key: string): string;

  // Method to create a new account using the ApiService signup method
  createNewAccount(formik: any): Promise<any>;

  // Method to handle OTP confirmation using the ApiService otpValidation method
  otpConfirmation(Account_Email: string, Account_OTP: string): Promise<any>;

  // Method to resend OTP for confirmation using the ApiService resendOTP method
  resendOTPForConfirmation(Account_Email: string): Promise<any>;

  // Method to fetch authenticated user information using the ApiService fetchAuth method
  getUserRoles(): Promise<any>;

  // Method to handle login for an existing account using the ApiService login method
  loginExitAccount(formik: any): Promise<any>;

  // Method to handle forgot password OTP validation using the ApiService forgotPassword method
  passwordOTPValidation(Account_Email_ForgetPass: string): Promise<any>;

  // Method to confirm new password using the ApiService confirmPassword method
  confirmNewPassword(
    Account_Email_ForgetPass: string,
    Account_OTP: string,
    Account_Password_newPassword: string
  ): Promise<any>;


}
