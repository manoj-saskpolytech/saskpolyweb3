import React, { useState } from "react"
import {
    Container,
    Typography,
    Box,
    Grid,
    useTheme,
    Stack,
    FormLabel,
    InputAdornment,
    IconButton,
} from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import "../../../index.css"
import { generateTokens } from "../../../theme"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import CustomTextField from "../../../controls/CustomTextField"
import { useFormik } from "formik"
import { IDocument } from "../../../models/IDocument"
import { initialDataSignIn } from "./initialDataSignIn"
import * as validationLib from "./validationAccountSignIn"
import { DocumentService } from "../../../services/Business/DocumentService"
import CustomButton from "../../../controls/Button"
import CustomToastMessage from "../../../controls/CustomToastMessage"
import ConfirmationDialog from "../../../controls/ConfirmationDialog/ConfirmationDialog"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import CustomDropdownLanguageSwitch from "../../../controls/CustomDropdownLanguageSwitch"
// import Cookies from "js-cookie";
// import { ApiService } from "../../../services/ApiService/ApiService";

const LoginComponent: React.FC = () => {
    const theme = useTheme()
    const [errorToastMessage, seterrorToastMessage] = useState("")
    const [errorToastMessageType, seterrorToastMessageType] = useState<any>("")
    const [showDialogForForgetPass, setshowDialogForForgetPass] = useState(true)
    const [showDialogForOTPGenerate, setshowDialogForOTPGenerate] =
        useState(true)
    const [showToast, setShowToast] = useState(false)
    const [resendDisabled, setResendDisabled] = useState(false)
    const [timer, setTimer] = useState(0)
    const [, setLoading] = useState(false)
    const navigate = useNavigate()
    const colors = generateTokens(theme.palette.mode)
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

    const formik = useFormik<IDocument>({
        initialValues: initialDataSignIn,
        validate: (values) => {
            return validationLib.validateSignIn(
                values,
                showDialogForOTPGenerate,
                showDialogForForgetPass,
            )
        },
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const result =
                    await DocumentService.getInstance().loginExitAccount(formik)
                const errorMessages = [
                    "Incorrect username or password.",
                    "username is required to signIn",
                    "password is required to signIn",
                    "There is already a signed in user",
                ]

                if (errorMessages.includes(result)) {
                    seterrorToastMessageType("error")
                    setShowToast(true)
                    seterrorToastMessage(result)
                } else {
                    seterrorToastMessageType("success")
                    setShowToast(true)
                    seterrorToastMessage(
                        generateLocalizationMsg(
                            "login_success",
                            "successfully Logged In",
                        ),
                    )
                    // Inside Account App after login
                    window.onload = function () {
                        const authData = {
                            event: "login",
                            token: localStorage.getItem(
                                "CognitoIdentityServiceProvider.670obn8euu81d8bu920631g67i.01abe5e0-d061-7015-7f05-129bea6ece06.accessToken",
                            ), // or however you're storing it
                        }
                        window.opener.postMessage(
                            authData,
                            "https://analytics.proxikle.xyz",
                        )
                    }

                    // Cookies.set("idToken", idToken,{secure: false, sameSite: "Lax", domain: "192.168.0.141", path: '/' });
                    // console.log("idToken",idToken);
                    await navigate("/Home")
                    resetForm()
                }
                resetForm()
            } catch (error) {
                console.error("Error during login:", error)
                seterrorToastMessageType("error")
                seterrorToastMessage(
                    generateLocalizationMsg(
                        "error_while_login",
                        "An unexpected error occurred. Please try again.",
                    ),
                )
                setShowToast(true)
                setSubmitting(false) // Reset submitting state in case of an error
            }
        },
    })

    const handleForgetPassEmailSend = async (
        Account_Email_ForgetPass: string,
    ) => {
        try {
            const result =
                await DocumentService.getInstance().ApiService.forgotPassword(
                    Account_Email_ForgetPass,
                )
            const errorMessages = [
                "username is required to resetPassword",
                "User does not exist or User Not Verified",
                "Attempt limit exceeded, please try after some time.",
            ]
            if (errorMessages.includes(result)) {
                setShowToast(true)
                seterrorToastMessageType("error")
                seterrorToastMessage(result)
                setshowDialogForOTPGenerate(false)
            } else {
                setShowToast(true)
                seterrorToastMessageType("success")
                seterrorToastMessage(
                    generateLocalizationMsg(
                        "otp_success",
                        "OTP successfully sent to your mail ID",
                    ),
                )
                setshowDialogForOTPGenerate(true)
                setshowDialogForForgetPass(false)
            }
        } catch (error) {
            console.error("Forgot password submission error", error)
        }
    }

    //handle otp submmission for confirm signup
    const handleNewPasswordSubmit = async (
        Account_Email_ForgetPass: string,
        Account_OTP: string,
        Account_Password_newPassword: string,
    ) => {
        try {
            setLoading(true)
            const isValidOtp =
                await DocumentService.getInstance().confirmNewPassword(
                    Account_Email_ForgetPass,
                    Account_OTP,
                    Account_Password_newPassword,
                )
            const errorMessages = [
                "Attempt limit exceeded, please try after some time.",
                "confirmationCode is required to confirmResetPassword",
                "Invalid OTP",
                "Invalid verification code provided, please try again.",
                "newPassword is required to confirmResetPassword",
            ]
            if (errorMessages.includes(isValidOtp)) {
                setShowToast(true)
                seterrorToastMessageType("error")
                seterrorToastMessage(isValidOtp)
                setshowDialogForForgetPass(false)
            } else {
                setShowToast(true)
                seterrorToastMessageType("success")
                seterrorToastMessage(
                    generateLocalizationMsg(
                        "password_changed",
                        "New password changed successfully",
                    ),
                )
                setshowDialogForForgetPass(true)
                // await navigate("/SigIn");
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
                        "error_while_login",
                        "An error occurred during OTP validation",
                    ),
            )
        }
    }

    //handle otp resend to the user
    const handleResendOTP = async (Account_Email: string) => {
        try {
            setLoading(true)
            await DocumentService.getInstance().resendOTPForConfirmation(
                Account_Email,
            )
            setShowToast(true)
            seterrorToastMessageType("success")
            seterrorToastMessage(
                generateLocalizationMsg(
                    "otp_success",
                    "OTP successfully sent to your mail ID",
                ),
            )
            setResendDisabled(true)
            setTimer(30) // Reset timer when resend is clicked
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
                className="mainForm"
                sx={{
                    p: 2,
                    height: "100vh",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        height: "19px",
                    }}
                >
                    <CustomDropdownLanguageSwitch />
                </div>
                <Container
                    component="main"
                    sx={{
                        marginTop: "6%",
                        width: "60%",
                        backgroundColor: colors.white[100],
                        borderRadius: "20px",
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="h2"
                                    component="div"
                                    sx={{
                                        display: "flex",
                                        alignSelf: "self-start",
                                    }}
                                >
                                    <img
                                        src="logo.png"
                                        alt="SaskPolyWeb3 Logo Not Found"
                                        style={{
                                            marginRight: "5px",
                                            width: "145px",
                                            height: "25px",
                                            backgroundSize: "fit",
                                            marginBottom: "5px",
                                        }}
                                    />
                                </Typography>
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    sx={{
                                        display: "flex",
                                        alignSelf: "self-start",
                                        fontWeight: "revert-layer",
                                        paddingTop: "20px",
                                        paddingBottom: "5px",
                                        color: "#253858",
                                    }}
                                >
                                    {generateLocalizationMsg(
                                        "signin",
                                        "Sign In",
                                    )}
                                </Typography>
                                <Box sx={{ lineHeight: "40px", width: "100%" }}>
                                    {
                                        <ConfirmationDialog
                                            title={generateLocalizationMsg(
                                                "forgot_password",
                                                "Forgot Password",
                                            )}
                                            message={generateLocalizationMsg(
                                                "otp_title",
                                                "A one-time password will be sent to your registered email address for verification.",
                                            )}
                                            hidden={showDialogForOTPGenerate}
                                            SubmitOnClick={() => {
                                                handleForgetPassEmailSend(
                                                    formik.values
                                                        .Account_Email_ForgetPass,
                                                )
                                            }}
                                            readOnly={false}
                                            formik={formik}
                                            onClose={() =>
                                                setshowDialogForOTPGenerate(
                                                    true,
                                                )
                                            }
                                            CloseVisibleIcon={true}
                                            oktext={generateLocalizationMsg(
                                                "send_otp",
                                                "Send OTP",
                                            )}
                                            fieldHidden={true}
                                            fieldHiddenForgotPass={false}
                                        />
                                    }
                                    {
                                        <ConfirmationDialog
                                            title={generateLocalizationMsg(
                                                "forgotpassword_Title",
                                                "Create New Password",
                                            )}
                                            // message={generateLocalizationMsg("otp_title","A one-time password will be sent to your registered email address for verification.")}
                                            message={generateLocalizationMsg(
                                                "otp_send_changepassword",
                                                "A one-time password will be sent to your registered email address for verification.",
                                            )}
                                            hidden={showDialogForForgetPass}
                                            SubmitOnClick={() => {
                                                handleNewPasswordSubmit(
                                                    formik.values
                                                        .Account_Email_ForgetPass,
                                                    formik.values.Account_OTP,
                                                    formik.values
                                                        .Account_Password_newPassword,
                                                )
                                            }}
                                            formik={formik}
                                            onClose={() =>
                                                setshowDialogForForgetPass(true)
                                            }
                                            CloseVisibleIcon={true}
                                            oktext={generateLocalizationMsg(
                                                "verify",
                                                "Verify",
                                            )}
                                            fieldHidden={true}
                                            readOnly={true}
                                            timerText={timer}
                                            closeText={generateLocalizationMsg(
                                                "resend_otp",
                                                "Resend OTP",
                                            )}
                                            disabled={resendDisabled}
                                            fieldHiddenForgotPass={true}
                                            onResendOtp={() => {
                                                handleResendOTP(
                                                    formik.values
                                                        .Account_Email_ForgetPass,
                                                )
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
                                    {/* To display toast message in signIn */}
                                    {showToast && (
                                        <CustomToastMessage
                                            message={errorToastMessage}
                                            messageType={errorToastMessageType}
                                            onClose={() => setShowToast(false)}
                                        />
                                    )}
                                    <FormLabel className="globalLabelName">
                                        {generateLocalizationMsg(
                                            "email_id",
                                            "Email",
                                        )}
                                        <span className="requiredLabel">*</span>
                                    </FormLabel>
                                    <CustomTextField
                                        id="Account_Email"
                                        name="Account_Email"
                                        placeholder={generateLocalizationMsg(
                                            "enter_email",
                                            "Enter Email ID",
                                        )}
                                        formik={formik}
                                        InputProps={{
                                            style: {
                                                height: "36px",
                                                color: "#253858",
                                                backgroundColor: "#ffffff",
                                                padding: "10px",
                                                borderRadius: "3px",
                                            },
                                        }} // Adjust the height here
                                        autoComplete="new-password"
                                    />
                                    <FormLabel className="globalLabelName">
                                        {generateLocalizationMsg(
                                            "password",
                                            "Password",
                                        )}
                                        {/* <span className="requiredLabel">*</span> */}
                                    </FormLabel>
                                    <CustomTextField
                                        autoComplete="new-password"
                                        placeholder={generateLocalizationMsg(
                                            "enter_password",
                                            "Enter Password",
                                        )}
                                        name="Account_Password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="Account_Password"
                                        formik={formik}
                                        InputProps={{
                                            style: {
                                                height: "36px",
                                                color: "#253858",
                                                backgroundColor: "#ffffff",
                                                padding: "10px",
                                                borderRadius: "3px",
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
                                        {generateLocalizationMsg(
                                            "log_in",
                                            "Log In",
                                        )}
                                    </CustomButton>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "end",
                                        }}
                                    >
                                        <CustomButton
                                            style={{
                                                color: "#253858",
                                                fontSize: "12px",
                                                textTransform: "none",
                                                paddingTop: "10px",
                                                backgroundColor: "transparent",
                                                cursor: "default",
                                            }}
                                            onClick={() => {
                                                setshowDialogForOTPGenerate(
                                                    false,
                                                )
                                            }}
                                        >
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {generateLocalizationMsg(
                                                    "forgot_password",
                                                    "Forgot Password?",
                                                )}
                                            </span>
                                        </CustomButton>
                                    </Box>
                                    {/* <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" marginTop="5px" marginBottom="10px">
        <Typography variant="h5" component="div" sx={{ width:"25%",display: 'flex',fontWeight:"500 !important"}}>
       generateLocalizationMsg("sign_using_full","or Sign In using")
</Typography>
          <Box sx={{width:"75%" ,margin:"10px !important",display:"flex",gap:"10px"}} >
          <img src="https://proxiklestatic.com/products/accounts/google_logo_.svg" alt="google_logo Not Available" className="customSignInIcon" />
          <img src="https://proxiklestatic.com/products/accounts/microsoft__logo.svg" alt="Microsoft_logo Not Available" className="customSignInIcon" />
          </Box>
        </Stack> */}
                                    <CustomButton
                                        style={{
                                            display: "block",
                                            color: colors.blue[500],
                                            paddingTop: "5px",
                                            textTransform: "none",
                                            paddingBottom: "20px",
                                            fontSize: "14px",
                                            backgroundColor: "transparent",

                                            cursor: "default",
                                        }}
                                        onClick={() => {
                                            navigate("/SignUp")
                                        }}
                                    >
                                        <span
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            {generateLocalizationMsg(
                                                "create_account",
                                                "Create a SaskPolyWeb3 Account",
                                            )}
                                        </span>
                                    </CustomButton>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                paddingBottom: "20px",
                            }}
                        >
                            <Box>
                                <img
                                    src="https://proxiklestatic.com/products/accounts/lap_image.svg" // Update this path to the correct image location
                                    alt="Device_soup_img Not Available"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "8px",
                                        background: "",
                                    }}
                                />
                                <Stack
                                    direction="column"
                                    sx={{
                                        mt: 5,
                                        display: "flex",
                                        justifyContent: "center",
                                        // width: "85%",
                                        // marginInlineStart: "auto",
                                        gap: "10px",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 1,
                                            color: "#253858",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <img
                                            src="https://proxiklestatic.com/products/accounts/check_.png"
                                            alt="CheckLat Not Available"
                                            style={{
                                                width: "18px",
                                            }}
                                        />{" "}
                                        &ensp;
                                        {generateLocalizationMsg(
                                            "feature_1",
                                            "Mobile-ready for On-the-Go Access.",
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 1,
                                            color: "#253858",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <img
                                            src="https://proxiklestatic.com/products/accounts/check_.png"
                                            alt="CheckLat Not Available"
                                            style={{
                                                width: "18px",
                                            }}
                                        />{" "}
                                        &ensp;
                                        {generateLocalizationMsg(
                                            "feature_2",
                                            "Multi-Language Support.",
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 1,
                                            color: "#253858",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <img
                                            src="https://proxiklestatic.com/products/accounts/check_.png"
                                            alt="CheckLat Not Available"
                                            style={{
                                                width: "18px",
                                            }}
                                        />{" "}
                                        &ensp;
                                        {generateLocalizationMsg(
                                            "feature_3",
                                            "Simple, Intuitive User Interface.",
                                        )}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <Typography
                    variant="h6"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "5.5%",
                        color: "#253858",
                    }}
                >
                    &copy;&nbsp;
                    {generateLocalizationMsg(
                        "footer",
                        "2024 Saskatchewan Polytechnic. All Rights Reserved",
                    )}
                </Typography>
            </Box>
        </ThemeProvider>
    )
}

export default LoginComponent
