import { IApiService } from "./IApiService"
import _ from "lodash"
import * as Auth from "aws-amplify/auth"
import {
    CognitoIdentityProviderClient,
    GetUserCommand,
    ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import axios from "axios"

// Logging utility
const logLevels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
}

const currentLogLevel = logLevels.INFO // Adjust based on your environment

function log(level: number, message: string, error?: any) {
    if (level <= currentLogLevel) {
        const timestamp = new Date().toISOString()
        const logMessage = `[${timestamp}] ${message}`

        switch (level) {
            case logLevels.ERROR:
                console.error(logMessage, error)
                break
            case logLevels.WARN:
                console.warn(logMessage)
                break
            case logLevels.INFO:
                console.info(logMessage)
                break
            case logLevels.DEBUG:
                console.debug(logMessage)
                break
        }
    }
}

export class ApiService implements IApiService {
    private static instance: ApiService
    private appConfig: { [key: string]: any } = {}
    private locConfig: { [key: string]: any } = {}
    private cognitoClient: CognitoIdentityProviderClient
    private configCache: Map<string, any> = new Map()
    private static accessTokenCache: string | null = null
    private static accessTokenExpiry: number = 0

    private constructor() {
        this.cognitoClient = new CognitoIdentityProviderClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
                secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
            },
        })
        log(logLevels.INFO, "ApiService instance created")
    }

    static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService()
            log(logLevels.INFO, "New ApiService instance created")
        }
        return ApiService.instance
    }

    static getAccessToken() {
        const keyPrefix = "CognitoIdentityServiceProvider"
        const keySuffix = ".accessToken"

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(keyPrefix) && key.endsWith(keySuffix)) {
                const accessToken = localStorage.getItem(key)
                log(logLevels.DEBUG, "Access token retrieved from localStorage")
                return accessToken
            }
        }

        log(logLevels.WARN, "No access token found in localStorage")
        return null
    }

    public async loadlocalizeConfig(): Promise<void> {
        try {
            const sessionKey = "localizationConfig"
            let apiData: any = null

            let storedConfig = sessionStorage.getItem(sessionKey)

            if (storedConfig) {
                try {
                    const parsedConfig = JSON.parse(storedConfig)
                    if (parsedConfig && typeof parsedConfig === "object") {
                        apiData = parsedConfig
                        log(
                            logLevels.INFO,
                            "Loaded localization config from session storage",
                        )
                    } else {
                        throw new Error("Invalid data in session storage")
                    }
                } catch (e) {
                    log(
                        logLevels.ERROR,
                        "Error parsing session storage data:",
                        e,
                    )
                }
            }

            if (!apiData) {
                log(logLevels.INFO, "Fetching localization config from API")
                const response = await axios.get(
                    "https://zgkys64801.execute-api.us-east-2.amazonaws.com/languages/accounts",
                )

                if (response.status !== 200) {
                    throw new Error(
                        `Failed to fetch data from API. Status: ${response.status}`,
                    )
                }

                apiData = response.data
                log(logLevels.DEBUG, "API response received", apiData)

                sessionStorage.setItem(sessionKey, JSON.stringify(apiData))
                log(logLevels.INFO, "Stored API response in session storage")
            }

            if (_.isEmpty(apiData)) {
                log(logLevels.WARN, "API data is empty")
                return
            }

            const config = {}
            const browserLanguage =
                await this.getLocConfigJSON("BrowserLangConfig")

            _.each(apiData, (item) => {
                const title = item.key
                if (!config[title]) {
                    config[title] = {}
                }
                if (item.chinnese && browserLanguage === "zh-CN") {
                    config[title] = item.chinnese
                } else if (item.spanish && browserLanguage === "es") {
                    config[title] = item.spanish
                } else {
                    config[title] = item.english
                }
            })

            _.set(this.locConfig, "JSONContentofLocalization", config)
            log(logLevels.INFO, "Localization config loaded successfully")
        } catch (error) {
            log(logLevels.ERROR, "Error loading localization config:", error)
            throw new Error("Failed to load localization config")
        }
    }

    public setConfigValue(configname: string, configvalue: string) {
        this.appConfig = { ...this.appConfig, [configname]: configvalue }
        log(logLevels.DEBUG, `Config value set: ${configname}`)
    }

    public getLocConfigValue(configname: string): string {
        try {
            if (_.isEmpty(this.locConfig)) {
                log(logLevels.WARN, "Localization config is empty")
                return ""
            }

            if (this.locConfig[configname]) return this.locConfig[configname]

            const value = _.get(
                JSON.parse(this.locConfig["JSONContentofLocalization"]),
                configname,
                "",
            )
            log(
                logLevels.DEBUG,
                `Retrieved loc config value for: ${configname}`,
            )
            return value
        } catch (error) {
            log(
                logLevels.ERROR,
                `Error getting loc config value for: ${configname}`,
                error,
            )
            throw new Error("Failed to get loc config value")
        }
    }

    public getLocConfigJSON(configname: string): any {
        try {
            if (_.isEmpty(this.locConfig)) {
                log(logLevels.WARN, "Localization config is empty")
                return {}
            }

            if (this.locConfig[configname]) {
                return JSON.parse(this.locConfig[configname])
            }

            log(logLevels.DEBUG, `Retrieved loc config JSON for: ${configname}`)
            return JSON.parse(this.locConfig["JSONContentofLocalization"])
        } catch (error) {
            log(
                logLevels.ERROR,
                `Error getting loc config JSON for: ${configname}`,
                error,
            )
            return {}
        }
    }
    public setLocConfigValue(configname: string, configvalue: string): void {
        this.locConfig[configname] = configvalue
        this.configCache.set(configname, configvalue)
        log(logLevels.DEBUG, `Loc config value set: ${configname}`)
    }

    public getConfigJSON(configname: string): any {
        try {
            const cacheKey = `json_${configname}`
            if (this.configCache.has(cacheKey)) {
                return this.configCache.get(cacheKey)
            }

            if (_.isEmpty(this.appConfig)) {
                log(logLevels.WARN, "App config is empty")
                return {}
            }

            let result
            if (this.appConfig[configname]) {
                result = JSON.parse(this.appConfig[configname])
            } else {
                result = JSON.parse(
                    this.appConfig["JSONFileContainerObject"] || "{}",
                )
            }

            this.configCache.set(cacheKey, result)
            log(logLevels.DEBUG, `Retrieved config JSON for: ${configname}`)
            return result
        } catch (error) {
            log(
                logLevels.ERROR,
                `Error getting config JSON for: ${configname}`,
                error,
            )
            return {}
        }
    }

    public getConfigValue(configname: string): string {
        try {
            if (this.configCache.has(configname)) {
                return this.configCache.get(configname)
            }

            if (_.isEmpty(this.appConfig)) {
                log(logLevels.WARN, "App config is empty")
                return ""
            }

            const value = this.appConfig[configname] || ""
            this.configCache.set(configname, value)
            log(logLevels.DEBUG, `Retrieved config value for: ${configname}`)
            return value
        } catch (error) {
            log(
                logLevels.ERROR,
                `Error getting config value for: ${configname}`,
                error,
            )
            throw new Error("Failed to get config value")
        }
    }

    public async checkIfUserExists(
        email: string,
        userPoolId: string,
    ): Promise<any> {
        if (_.isEmpty(email)) {
            log(logLevels.WARN, "Empty email provided for user existence check")
            return "User does not exist or User Not Verified"
        }
        const command = new ListUsersCommand({
            UserPoolId: userPoolId,
            Filter: `email = "${email}"`,
        })

        try {
            const response = await this.cognitoClient.send(command)

            if (response.Users && response.Users.length > 0) {
                const user = response.Users[0]
                const emailVerifiedAttribute = user.Attributes?.find(
                    (attr) => attr.Name === "email_verified",
                )
                const emailVerified = emailVerifiedAttribute
                    ? emailVerifiedAttribute.Value === "false"
                        ? false
                        : true
                    : false

                log(
                    logLevels.INFO,
                    `User existence check for ${email}: ${emailVerified ? "Verified" : "Not Verified"}`,
                )
                return emailVerified
            } else {
                log(logLevels.INFO, `User ${email} does not exist`)
                return false
            }
        } catch (error) {
            log(
                logLevels.ERROR,
                `Error checking if user ${email} exists:`,
                error,
            )
            throw error
        }
    }

    public async validateAccessToken(): Promise<boolean> {
        const accessToken = ApiService.getAccessToken()
        if (accessToken) {
            try {
                const command = new GetUserCommand({
                    AccessToken: accessToken,
                })

                await this.cognitoClient.send(command)
                log(logLevels.INFO, "Access token validated successfully")
                return true
            } catch (error) {
                log(logLevels.ERROR, "Error validating access token:", error)
                return false
            }
        } else {
            log(logLevels.WARN, "No valid access token found")
            return false
        }
    }

    public async checkIfUserNameExist(
        userpooId: string,
        UserName: string,
    ): Promise<boolean> {
        const cacheKey = `userNameExists_${UserName}`
        if (this.configCache.has(cacheKey)) {
            return this.configCache.get(cacheKey)
        }

        try {
            const UserNamecommand = new ListUsersCommand({
                UserPoolId: userpooId,
                Filter: `preferred_username = "${UserName}"`,
            })
            const responseUserName =
                await this.cognitoClient.send(UserNamecommand)
            const exists = !!(
                responseUserName.Users && responseUserName.Users.length > 0
            )

            this.configCache.set(cacheKey, exists)
            log(
                logLevels.INFO,
                `Username ${UserName} ${exists ? "already exists" : "is available"}`,
            )
            return exists
        } catch (error) {
            log(
                logLevels.ERROR,
                `Error checking if username ${UserName} exists:`,
                error,
            )
            throw error
        }
    }

    public async signup(
        Account_First_Name: string,
        Account_Last_Name: string,
        Account_User_Name: string,
        Account_Email: string,
        Account_Password: string,
        Account_allowsNewsletter: string,
    ): Promise<any> {
        try {
            const userpooId = "us-east-1_rKgMdcxBJ"
            const [userExists, userNameExists] = await Promise.all([
                this.checkIfUserExists(Account_Email, userpooId),
                this.checkIfUserNameExist(userpooId, Account_User_Name),
            ])

            if (!userExists && !userNameExists) {
                const result = await Auth.signUp({
                    username: Account_Email,
                    password: Account_Password,
                    options: {
                        userAttributes: {
                            email: Account_Email,
                            given_name: Account_First_Name,
                            family_name: Account_Last_Name,
                            preferred_username: Account_User_Name,
                            "custom:NewsLetters":
                                Account_allowsNewsletter.toString(),
                        },
                        autoSignIn: true,
                    },
                })
                log(
                    logLevels.INFO,
                    `User signed up successfully: ${Account_Email}`,
                )
                return JSON.stringify({ result })
            } else {
                log(
                    logLevels.WARN,
                    `User Email or User Name already exists: ${Account_Email}`,
                )
                return "User Email or User Name already exists or User Not Verified"
            }
        } catch (error: any) {
            if (error.name === "UsernameExistsException") {
                log(logLevels.WARN, `Username already exists: ${Account_Email}`)
                return error.name
            } else {
                log(logLevels.ERROR, "Signup error:", error)
                return error.message
            }
        }
    }

    public async otpValidation(
        Account_Email: string,
        Account_OTP: number,
    ): Promise<any> {
        try {
            const result = await Auth.confirmSignUp({
                username: Account_Email,
                confirmationCode: Account_OTP.toString(),
            })
            log(
                logLevels.INFO,
                `OTP validated successfully for: ${Account_Email}`,
            )
            return result
        } catch (error: any) {
            log(
                logLevels.ERROR,
                `OTP validation error for ${Account_Email}:`,
                error,
            )
            return error.message
        }
    }

    public async resendOTP(Email: string): Promise<any> {
        try {
            const userpooId = "us-east-1_rKgMdcxBJ"
            const userExists = await this.checkIfUserExists(Email, userpooId)
            if (userExists) {
                await Auth.resendSignUpCode({
                    username: Email,
                })
                log(logLevels.INFO, `OTP resent successfully to: ${Email}`)
                return "Check your inbox for OTP Validation"
            } else {
                log(
                    logLevels.WARN,
                    `User does not exist or is not verified: ${Email}`,
                )
                return "User does not exist or User Not Verified"
            }
        } catch (error: any) {
            log(logLevels.ERROR, `Error resending OTP to ${Email}:`, error)
            throw error.message
        }
    }

    static async fetchAuth(): Promise<any> {
        try {
            const result = await Auth.fetchAuthSession()
            log(logLevels.INFO, "Auth session fetched successfully")
            return result
        } catch (error: any) {
            log(logLevels.ERROR, "Fetch auth session error:", error)
            return error.message
        }
    }

    public async login(
        Account_Email: string,
        Account_Password: string,
    ): Promise<any> {
        try {
            const result = await Auth.signIn({
                username: Account_Email,
                password: Account_Password,
            })
            log(logLevels.INFO, `User logged in successfully: ${Account_Email}`)
            await axios.post("/login", { userId: Account_Email })
            return JSON.stringify({ result })
        } catch (error: any) {
            log(logLevels.ERROR, `Login error for ${Account_Email}:`, error)
            return error.message
        }
    }

    static async logout(): Promise<any> {
        try {
            await Auth.signOut()
            log(logLevels.INFO, "User logged out successfully")
            // await axios.post("/logout", { userId: Account_Email });
        } catch (error) {
            log(logLevels.ERROR, "Error logging out:", error)
            throw error
        }
    }

    // Add the missing methods

    public async forgotPassword(
        Account_Email_ForgetPass: string,
    ): Promise<any> {
        try {
            const userpooId = "us-east-1_rKgMdcxBJ"
            const userExists = await this.checkIfUserExists(
                Account_Email_ForgetPass,
                userpooId,
            )
            if (userExists) {
                const result = await Auth.resetPassword({
                    username: Account_Email_ForgetPass,
                })
                log(
                    logLevels.INFO,
                    `Password reset initiated for: ${Account_Email_ForgetPass}`,
                )
                return JSON.stringify({ result })
            } else {
                log(
                    logLevels.WARN,
                    `User does not exist or is not verified: ${Account_Email_ForgetPass}`,
                )
                return "User does not exist or User Not Verified"
            }
        } catch (error: any) {
            log(
                logLevels.ERROR,
                `Forgot password error for ${Account_Email_ForgetPass}:`,
                error,
            )
            return error.message
        }
    }

    public async confirmPassword(
        Account_Email_ForgetPass: string,
        Account_OTP: string,
        Account_Password_newPassword: string,
    ): Promise<any> {
        try {
            const result = await Auth.confirmResetPassword({
                username: Account_Email_ForgetPass,
                confirmationCode: Account_OTP,
                newPassword: Account_Password_newPassword,
            })
            log(
                logLevels.INFO,
                `Password reset confirmed for: ${Account_Email_ForgetPass}`,
            )
            return JSON.stringify({ result })
        } catch (error: any) {
            log(
                logLevels.ERROR,
                `Confirm password error for ${Account_Email_ForgetPass}:`,
                error,
            )
            return error.message
        }
    }
}
