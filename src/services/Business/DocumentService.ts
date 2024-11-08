import { ApiService } from "../ApiService/ApiService";
import { IDocumentService } from "./IDocumentService";
import * as _ from "lodash";
import Cookies from 'js-cookie';

export class DocumentService implements IDocumentService {
  private static instance: DocumentService;
  public ApiService: ApiService; // Define ApiService property
  private configCache: { [key: string]: any } = {}; // Cache for configuration values

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.ApiService = ApiService.getInstance(); // Instantiate ApiService
  }

  // Singleton pattern to ensure only one instance of DocumentService
  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  static getBrowserLangConfigValue() {
    // Check if the language is already set in cookies
    const storedLanguage = Cookies.get("BrowserLangConfig");
    if (storedLanguage) {
      return storedLanguage;
    } else {
      const apiLangConfig = DocumentService.getInstance().ApiService.getLocConfigJSON("BrowserLangConfig");
      // Optionally cache in memory
      DocumentService.getInstance().configCache.browserLangConfig = apiLangConfig;
      return apiLangConfig;
    }
  }

  static getLocValueByKey(key: string, defaultValue: string) {
    //const localizationData = DocumentService.getInstance().ApiService.getLocConfigValue("JSONContentofLocalization");
    return defaultValue;
  }

  static getLocConfigValue(key: string) {
    const cache = DocumentService.getInstance().configCache[key];
    if (cache) {
      return cache;
    }
    const value = DocumentService.getInstance().ApiService.getLocConfigValue(key);
    DocumentService.getInstance().configCache[key] = value;
    return value;
  }

  static getLocConfigJSON(key: string) {
    const cache = DocumentService.getInstance().configCache[key];
    if (cache) {
      return cache;
    }
    const value = DocumentService.getInstance().ApiService.getLocConfigJSON(key);
    DocumentService.getInstance().configCache[key] = value;
    return value;
  }

  public getConfigValue(key: string): string {
    const cache = this.configCache[key];
    if (cache) {
      return cache;
    }
    const value = this.ApiService.getConfigValue(key);
    this.configCache[key] = value;
    return value;
  }

  static getConfigJSON(key: string) {
    const cache = DocumentService.getInstance().configCache[key];
    if (cache) {
      return cache;
    }
    const value = DocumentService.getInstance().ApiService.getConfigJSON(key);
    DocumentService.getInstance().configCache[key] = value;
    return value;
  }

  static getCurrentUserInfo() {
    return DocumentService.getInstance().ApiService.getConfigJSON("UserRoles");
  }

  public async setBrowserLangConfigValue(Language: string): Promise<any> {
    try {
      console.log("Setting BrowserLangConfig to:", Language);
      this.ApiService.setLocConfigValue("BrowserLangConfig", JSON.stringify(Language));
      return { Language };
    } catch (error) {
      console.error("Error setting BrowserLangConfig:", error);
      throw error;
    }
  }

  public async createNewAccount(formik: any): Promise<any> {
    try {
      const accountData = _.cloneDeep(formik.values);
      const newAccountResult = await this.ApiService.signup(
        accountData.Account_First_Name,
        accountData.Account_Last_Name,
        accountData.Account_User_Name,
        accountData.Account_Email,
        accountData.Account_Password,
        accountData.Account_allowsNewsletter
      );
      return newAccountResult;
    } catch (error) {
      console.error("Submission error:", error);
      throw error; // Re-throw to ensure the caller handles it
    }
  }

  public async otpConfirmation(Account_Email: string, Account_OTP: string): Promise<any> {
    try {
      const otpValidation = await this.ApiService.otpValidation(Account_Email, +Account_OTP);
      return otpValidation;
    } catch (error) {
      console.error("OTP validation error:", error);
      throw error; // Re-throw to ensure the caller handles it
    }
  }

  public async resendOTPForConfirmation(Email: string): Promise<any> {
    try {
      const resendOTP = await this.ApiService.resendOTP(Email);
      return resendOTP;
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error; // Re-throw to ensure the caller handles it
    }
  }

  public async getUserRoles(): Promise<any> {
    try {
      const authResult = await ApiService.fetchAuth();
      if (!authResult?.tokens) {
        return null;
      }

      const { email, given_name, family_name } = authResult.tokens.idToken.payload;
      const userRoles = { currentuserEmail: email, firstName: given_name, lastName: family_name };
      this.ApiService.setConfigValue("UserRoles", JSON.stringify(userRoles));
      return userRoles;
    } catch (error) {
      console.error("Error during UserInfo fetch:", error);
      throw error; // Re-throw to ensure the caller handles it
    }
  }

  public async loginExitAccount(formik: any): Promise<any> {
    try {
      const accountData = _.cloneDeep(formik.values);
      const result = await this.ApiService.login(accountData.Account_Email, accountData.Account_Password);
      return result;
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // Re-throw to ensure the caller handles it
    }
  }

  public async passwordOTPValidation(Account_Email_ForgetPass: string): Promise<any> {
    try {
      const result = await this.ApiService.forgotPassword(Account_Email_ForgetPass);
      return result;
    } catch (error) {
      console.error("Error during password OTP validation:", error);
      throw error; // Re-throw to ensure the caller handles it
    }
  }

  public async confirmNewPassword(
    Account_Email_ForgetPass: string,
    Account_OTP: string,
    Account_Password_newPassword: string
  ): Promise<any> {
    try {
      const result = await this.ApiService.confirmPassword(
        Account_Email_ForgetPass,
        Account_OTP,
        Account_Password_newPassword
      );
      return result;
    } catch (error) {
      console.error("Error during password confirmation:", error);
      throw error; // Re-throw to ensure the caller handles it
    }
  }
}
