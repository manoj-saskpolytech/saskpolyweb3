import React, { useEffect, useState } from "react"
import {
    Container,
    Typography,
    Link,
    Box,
    Grid,
    Stack,
    useTheme,
    FormLabel,
    InputAdornment,
    IconButton,
} from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import "../../../index.css"
import { generateTokens } from "../../../theme"
import Typewriter from "typewriter-effect"
import { useFormik } from "formik"
import { initialDataSignUp } from "./initialDataSignUp"
import { IDocument } from "../../../models/IDocument"
import CustomTextField from "../../../controls/CustomTextField"
import CustomButton from "../../../controls/Button/index"
import { DocumentService } from "../../../services/Business/DocumentService"
import * as validationLib from "./validationAccountSignUp"
import ConfirmationDialog from "../../../controls/ConfirmationDialog/ConfirmationDialog"
import { useNavigate } from "react-router-dom"
// import Loader from "../../Loader/Index";
import CustomCheckbox from "../../../controls/CustomCheckBox/CustomCheck"
import CustomToastMessage from "../../../controls/CustomToastMessage"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import _ from "lodash"
import CustomDropdownLanguageSwitch from "../../../controls/CustomDropdownLanguageSwitch"

const SignUpComponent: React.FC = () => {
    const theme = useTheme()
    const colors = generateTokens(theme.palette.mode)
    const [showDialogForOTP, setshowDialogForOTP] = useState(true)

    const [resendDisabled, setResendDisabled] = useState(false)
    const [timer, setTimer] = useState(0)
    const [, setState] = useState(initialDataSignUp)
    const [errorToastMessage, seterrorToastMessage] = useState("")
    const [errorToastMessageType, seterrorToastMessageType] = useState<any>("")
    const [showToast, setShowToast] = useState(false)
    const [, setLoading] = useState(false)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const generateLocalizationMsg = (Key: string, defaulValue: string) => {
        return DocumentService.getLocValueByKey(Key, defaulValue)
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
    }

    useEffect(() => {
        let countdown
        if (resendDisabled && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        } else if (timer === 0) {
            setResendDisabled(false)
        }
        return () => clearInterval(countdown)
    }, [resendDisabled, timer])
    //handle entire form submission and reset fields using formik library

    const formik = useFormik<IDocument>({
        initialValues: initialDataSignUp,
        validate: (values) => {
            return validationLib.validateSigUp(values, showDialogForOTP)
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setLoading(true)
                const result =
                    await DocumentService.getInstance().createNewAccount(formik)
                console.log("result", result)
                if (
                    result ===
                    "User Email or User Name is already exists or User Not Verified"
                ) {
                    setShowToast(true)
                    seterrorToastMessageType("error")
                    seterrorToastMessage(
                        generateLocalizationMsg(
                            "not_verified",
                            "User Email or User Name is already exists or User Not Verified, Please try with different email ID or User Name or Verify the User",
                        ),
                    )
                    setshowDialogForOTP(true)
                } else {
                    setShowToast(true)
                    seterrorToastMessageType("success")
                    seterrorToastMessage(
                        generateLocalizationMsg(
                            "signup_success",
                            "SignUp Successfully ,OTP Sent to your Mail ID",
                        ),
                    )
                    setshowDialogForOTP(false)
                }
                setLoading(false)
            } catch (error) {
                console.error("Submission error", error)
            } finally {
                setSubmitting(false)
            }
        },
    })

    const handleReset = () => {
        setState(initialDataSignUp)
    }

    //handle otp submmission for confirm signup
    const handleOtpSubmit = async (
        Account_Email: string,
        Account_OTP: string,
    ) => {
        try {
            setLoading(true)
            const isValidOtp =
                await DocumentService.getInstance().otpConfirmation(
                    Account_Email,
                    Account_OTP,
                )
            const errorMessages = [
                "Invalid OTP",
                "code is required to confirmSignUp",
                "Invalid verification code provided, please try again.",
                "Invalid code provided, please request a code again.",
                "username is required to confirmSignUp",
            ]
            if (errorMessages.includes(isValidOtp)) {
                setShowToast(true)
                seterrorToastMessageType("error")
                seterrorToastMessage(isValidOtp)
                setshowDialogForOTP(false)
            } else {
                setShowToast(true)
                seterrorToastMessageType("success")
                seterrorToastMessage(
                    generateLocalizationMsg(
                        "account_success_Login",
                        "Your account is successfully ready to Login",
                    ),
                )
                setshowDialogForOTP(true)
                await navigate("/SignIn")
            }
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            console.error("OTP validation error:", error)
            setShowToast(true)
            seterrorToastMessageType("error")
            seterrorToastMessage(
                error.message ||
                    generateLocalizationMsg(
                        "otp_submit_error",
                        "An error occurred during OTP validation",
                    ),
            )
        }
    }

    //handle otp resend to the user
    const handleResendOTP = async (Account_Email: string) => {
        try {
            setLoading(true)
            const result =
                await DocumentService.getInstance().resendOTPForConfirmation(
                    Account_Email,
                )
            if (_.includes(result, "User does not exist.")) {
                setShowToast(true)
                seterrorToastMessageType("error")
                seterrorToastMessage(result)
                setshowDialogForOTP(false)
            } else {
                setShowToast(true)
                seterrorToastMessageType("success")
                seterrorToastMessage(result)
                setshowDialogForOTP(false)
            }
            setLoading(false)
        } catch (error: any) {
            setShowToast(true)
            seterrorToastMessageType("error")
            seterrorToastMessage(error.message)
            console.error("Resend OTP error:", error)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
                onReset={handleReset}
                className="mainForm"
            >
                {/* {Loading&&<Loader/>} */}
                {
                    <ConfirmationDialog
                        title={""}
                        message={generateLocalizationMsg(
                            "otp_title",
                            "A one-time password will be sent to your registered email address for verification.",
                        )}
                        hidden={showDialogForOTP}
                        SubmitOnClick={() => {
                            handleOtpSubmit(
                                formik.values.Account_Email,
                                formik.values.Account_OTP,
                            )
                        }}
                        formik={formik}
                        onClose={() => setshowDialogForOTP(true)}
                        CloseVisibleIcon={true}
                        oktext={generateLocalizationMsg("verify", "Verify")}
                        disabled={resendDisabled}
                        timerText={timer}
                        readOnly={true}
                        fieldHiddenForgotPass={true}
                        closeText={generateLocalizationMsg(
                            "resend_otp",
                            "Resend OTP",
                        )}
                        onResendOtp={() => {
                            handleResendOTP(formik.values.Account_Email)
                        }}
                        id="Account_OTP"
                        name="Account_OTP"
                        Placeholder={generateLocalizationMsg(
                            "enter_otp",
                            "Enter OTP",
                        )}
                    />
                }
                {/* To display toast message in signIn */}
                {showToast && (
                    <CustomToastMessage
                        message={errorToastMessage}
                        messageType={errorToastMessageType}
                        onClose={() => setShowToast(false)}
                    />
                )}
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={"1%"}
                >
                    <Typography
                        variant="h2"
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "5% !important",
                            width: "53%",
                        }}
                    >
                        <img
                            src="logo.png"
                            alt="SaskPolyWeb3 Logo Not Found"
                            style={{
                                marginRight: "5px",
                                width: "130px",
                                height: "20px",
                                backgroundSize: "fit",
                                marginBottom: "5px",
                            }}
                        />
                    </Typography>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                            height: "19px",
                            marginLeft: "7%",
                        }}
                    >
                        <CustomDropdownLanguageSwitch />
                    </div>
                    <Box className="SignInHeaderRightStyle">
                        <Typography
                            sx={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                            {generateLocalizationMsg(
                                "have_account",
                                "Already having a SaskPolyWeb3 account?",
                            )}
                        </Typography>
                        <CustomButton
                            style={{
                                color: colors.blue[500],
                                textTransform: "none",
                                fontSize: "14px",
                                backgroundColor: "transparent",
                                cursor: "default",
                            }}
                            onClick={() => {
                                navigate("/SignIn")
                            }}
                        >
                            <span
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                {generateLocalizationMsg("signin", "Sign In")}
                            </span>
                        </CustomButton>
                    </Box>
                </Stack>
                <Container
                    component="main"
                    style={{
                        backgroundColor: `${colors.white[100]}`,
                        borderRadius: "20px",
                        width: "60%",
                        marginTop: "3%",
                    }}
                >
                    <Box
                        sx={{
                            marginTop: "5%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            style={{
                                width: "89%",
                                marginTop: "35px",
                                marginBottom: "20px",
                                fontWeight: 700,
                                display: "flex",
                            }}
                        >
                            <label
                                style={{
                                    background:
                                        "linear-gradient(118deg, #FD7B1D 0%, #F0AF20 34%,#22AF95 67%,#00AEEF 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                <Typewriter
                                    options={{
                                        strings: [
                                            generateLocalizationMsg(
                                                "signup_analyze",
                                                "Analyze",
                                            ),
                                            generateLocalizationMsg(
                                                "signup_Build",
                                                "Build",
                                            ),
                                        ],
                                        autoStart: true,
                                        loop: true,
                                        cursor: "_",
                                        delay: 200,
                                        deleteSpeed: 200,
                                    }}
                                />
                            </label>
                            <span
                                style={{
                                    color: "#253858",
                                    position: "relative",
                                    left: "-6px",
                                }}
                            >
                                {generateLocalizationMsg(
                                    "signup_title",
                                    "the next big thing through us",
                                ).replace("Analyze ", "")}
                            </span>
                        </Typography>
                        <Box sx={{ margin: "10px 40px 0px 40px" }}>
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    className="globalGridAlign"
                                    xs={12}
                                    sm={6}
                                >
                                    <FormLabel className="globalLabelName">
                                        {generateLocalizationMsg(
                                            "first_name",
                                            "First Name",
                                        )}
                                        <span className="requiredLabel">*</span>
                                    </FormLabel>
                                    <CustomTextField
                                        id="Account_First_Name"
                                        name="Account_First_Name"
                                        placeholder={generateLocalizationMsg(
                                            "enter_firstname",
                                            "Enter First Name",
                                        )}
                                        autoComplete="new-password"
                                        formik={formik}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    className="globalGridAlign"
                                    xs={12}
                                    sm={6}
                                >
                                    <FormLabel className="globalLabelName">
                                        {generateLocalizationMsg(
                                            "last_name",
                                            "Last Name",
                                        )}
                                        <span className="requiredLabel">*</span>
                                    </FormLabel>
                                    <CustomTextField
                                        id="Account_Last_Name"
                                        autoComplete="new-password"
                                        name="Account_Last_Name"
                                        placeholder={generateLocalizationMsg(
                                            "enter_lastname",
                                            "Enter Last Name",
                                        )}
                                        formik={formik}
                                    />
                                </Grid>
                                <Grid item className="globalGridAlign" xs={12}>
                                    <FormLabel className="globalLabelName">
                                        {generateLocalizationMsg(
                                            "username",
                                            "User Name",
                                        )}
                                        <span className="requiredLabel">*</span>
                                    </FormLabel>
                                    <CustomTextField
                                        id="Account_User_Name"
                                        name="Account_User_Name"
                                        autoComplete="new-password"
                                        placeholder={generateLocalizationMsg(
                                            "enter_username",
                                            "Enter User Name",
                                        )}
                                        formik={formik}
                                    />
                                </Grid>
                                <Grid item className="globalGridAlign" xs={12}>
                                    <FormLabel className="globalLabelName">
                                        {generateLocalizationMsg(
                                            "email_id",
                                            "Email",
                                        )}
                                        <span className="requiredLabel">*</span>
                                    </FormLabel>
                                    <CustomTextField
                                        id="Account_Email"
                                        placeholder={generateLocalizationMsg(
                                            "enter_email",
                                            "Enter Email ID",
                                        )}
                                        autoComplete="new-password"
                                        name="Account_Email"
                                        formik={formik}
                                    />
                                </Grid>
                                <Grid item className="globalGridAlign" xs={12}>
                                    <FormLabel className="globalLabelName">
                                        {generateLocalizationMsg(
                                            "password",
                                            "Password",
                                        )}
                                        <span className="requiredLabel">*</span>
                                    </FormLabel>
                                    <CustomTextField
                                        name="Account_Password"
                                        placeholder={generateLocalizationMsg(
                                            "enter_password",
                                            "Enter Password",
                                        )}
                                        autoComplete="new-password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="Account_Password"
                                        formik={formik}
                                        InputProps={{
                                            style: {
                                                height: "40px",
                                                color: "#253858",
                                                backgroundColor: "#ffffff",
                                                padding: "10px",
                                                borderRadius: "5px",
                                            }, // Adjust the height here
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={
                                                            handleClickShowPassword
                                                        }
                                                        onMouseDown={
                                                            handleMouseDownPassword
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <EyeSlash fill="#253858" />
                                                        ) : (
                                                            <Eye fill="#253858" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomCheckbox
                                        id="Account_UserData_Store"
                                        label={generateLocalizationMsg(
                                            "data_storage",
                                            "My Data will be stored in Canada",
                                        )}
                                        formik={formik}
                                        readOnly={true}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomCheckbox
                                        id="Account_allowsNewsletter"
                                        label={generateLocalizationMsg(
                                            "newsletters",
                                            "Send me Web3 newsletters, Tutorials & marketing emails of SaskPolyWeb3 Products.",
                                        )}
                                        formik={formik}
                                        readOnly={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomCheckbox
                                        id="Account_Terms_And_Condition"
                                        label={
                                            <span>
                                                {generateLocalizationMsg(
                                                    "terms_policy_accept",
                                                    "I accept the",
                                                )}{" "}
                                                <Link
                                                    href="#"
                                                    variant="h6"
                                                    sx={{
                                                        color: `${colors.blue[500]} !important`,
                                                        textDecoration:
                                                            "underline",
                                                    }}
                                                >
                                                    {generateLocalizationMsg(
                                                        "site_terms_link",
                                                        "Site Terms",
                                                    )}
                                                </Link>{" "}
                                                {generateLocalizationMsg(
                                                    "terms_policy_and",
                                                    "and",
                                                )}{" "}
                                                <Link
                                                    href="#"
                                                    variant="h6"
                                                    sx={{
                                                        color: `${colors.blue[500]} !important`,
                                                        textDecoration:
                                                            "underline",
                                                    }}
                                                >
                                                    {generateLocalizationMsg(
                                                        "terms_policy_accept",
                                                        "Privacy Policy",
                                                    )}
                                                </Link>
                                            </span>
                                        }
                                        formik={formik}
                                        readOnly={false}
                                    />
                                    {formik.touched
                                        .Account_Terms_And_Condition &&
                                    formik.errors
                                        .Account_Terms_And_Condition ? (
                                        <div className="ErrorMessage">
                                            {typeof formik.errors
                                                .Account_Terms_And_Condition ===
                                            "string"
                                                ? formik.errors
                                                      .Account_Terms_And_Condition
                                                : null}
                                        </div>
                                    ) : null}
                                </Grid>
                            </Grid>
                            <CustomButton
                                type="submit"
                                fullWidth
                                id="submit"
                                formik={formik}
                                className="InitialSignInButtonStyle"
                                variant="contained"
                                sx={{
                                    backgroundColor: `${colors.blue[500]} !important`,
                                    "&:hover": {
                                        backgroundColor: `${colors.blue[400]}`, // Set your desired hover color here
                                    },
                                }}
                            >
                                {generateLocalizationMsg("signup", "Sign Up")}
                            </CustomButton>
                            <Typography
                                variant="h6"
                                gutterBottom
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingTop: "25px",
                                }}
                            >
                                {generateLocalizationMsg(
                                    "signin_using_or",
                                    "or",
                                )}
                            </Typography>
                        </Box>
                        {/* <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              marginTop="5px"
              marginBottom="25px"
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  width: "65%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  fontWeight: "500 !important",
                }}
              >
              {generateLocalizationMsg("sign_using","Sign In using")}
              </Typography>
              <Box
                sx={{
                  width: "35%",
                  margin: "10px !important",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <img
                  src="https://proxiklestatic.com/products/accounts/google_logo_.svg"
                  alt="google_logo Not Available"
                  className="customSignInIcon"
                />
                <img
                  src="https://proxiklestatic.com/products/accounts/microsoft__logo.svg"
                  alt="Microsoft_logo Not Available"
                  className="customSignInIcon"
                />
              </Box>
            </Stack> */}
                    </Box>
                </Container>
                <Typography
                    variant="h5"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                        color: "#253858",
                    }}
                >
                    <b>
                        &copy;
                        {generateLocalizationMsg(
                            "footer",
                            "2024 Saskatchewan Polytechnic. All Rights Reserved",
                        )}
                    </b>
                </Typography>
            </Box>
        </ThemeProvider>
    )
}

export default SignUpComponent
