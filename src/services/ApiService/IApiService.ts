export interface IApiService {

  // Method to set a configuration value
  setConfigValue(configname: string, configvalue: string): void;

  // Method to get a configuration value
  getConfigValue(configname: string): string;

  setLocConfigValue(key: string, value: string);

  getLocConfigValue(key: string): string;

  // Method to get a configuration JSON
  getConfigJSON(key: string): any;

  // New User SignUp or Create Account service method
  signup(
    Account_First_Name: string,
    Account_Last_Name: string,
    Account_User_Name: string,
    Account_Email: string,
    Account_Password: string,
    Account_allowsNewsletter:string
  ): Promise<any>;

  // Method to handle OTP submission for confirming signup
  otpValidation(Account_Email: string, Account_OTP: number): Promise<any>;

  // Method to resend OTP to the user
  resendOTP(Account_Email: string): Promise<any>;

  // Method to fetch authenticated user's profile data
  // fetchAuth(): Promise<any>;
  // currentSession(): Promise<any>;

  // Method for existing user login
  login(
    Account_Email: string,
    Account_Password: string
  ): Promise<any>;

  // Method to handle forgot password functionality - sending confirmation code
  forgotPassword(Account_Email_ForgetPass: string): Promise<any>;

  // Method to confirm new password using confirmation code
  confirmPassword(
    Account_Email_ForgetPass: string,
    Account_OTP: string,
    Account_Password_newPassword: string
  ): Promise<any>;

  // Method to check if user exists
  checkIfUserExists(email: string, userPoolId: string): Promise<any>

  loadlocalizeConfig():Promise<void>;

  getLocConfigJSON(key: string): any;

}
