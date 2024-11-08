import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography ,useTheme, Stack, InputAdornment} from "@mui/material";
import "../../index.css";
import { generateTokens } from "../../theme";
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider } from "@mui/material/styles";
import CustomTextField from "../CustomTextField";
import CustomButton from "../Button";
import { Eye,EyeSlash} from '@phosphor-icons/react';
import {IConfirmationDialogComponentProps} from "./IConfirmationDialogComponentProps";


const ConfirmationDialogComponent: React.FC<IConfirmationDialogComponentProps> = ({
  title, 
  message, 
  hidden, 
  SubmitOnClick, 
  onClose, 
  oktext, 
  closeText, 
  onResendOtp,
  formik,
  id,
  name,
  Placeholder,
  CloseVisibleIcon,
  fieldHidden,
  disabled,
  timerText,
  readOnly,
  fieldHiddenForgotPass

}) => {

  const theme = useTheme();
  const colors = generateTokens(theme.palette.mode);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const dialogStyles = {
    minWidth: "370px",
    maxWidth: "450px",
    minHeight: "200px",
    textAlign: "left" as "left",
    borderRadius: '10px',
    backgroundColor:"white"
    
  };

  const centerButtonStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginRight:"10px",
    width:"96%",
  };

 

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <ThemeProvider theme={theme}>
    <Dialog
      open={!hidden}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      PaperProps={{
        style: dialogStyles,
      }}

    >
      <DialogTitle id="dialog-title">
      <div style={{  paddingTop: 10 }}>
            <img src="../../../public/logo.png" alt="NoImage" style={{ width: "115px", height: "20px" }} />
          </div>
        {CloseVisibleIcon && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color:"#253858",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent onClick={handleBackdropClick} sx={{paddingBottom:"0px !important"}}>
        <div style={{width:"100%"}}>
        <Typography variant="body1" sx={{ paddingTop: "5px",color:"#253858",fontWeight:700,fontSize:18}}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ paddingTop: 1,paddingBottom:2,color:"#253858",fontWeight:500,fontSize:14}}>
            {message}
          </Typography>
          <Stack direction="column"
          spacing={2}
          alignItems="start"
          justifyContent="space-between">
                  {!fieldHidden &&(
          <CustomTextField
                    id={"Account_Email"}
                    name={"Account_Email"}
                    placeholder={"abc@outlook.com"}
                    formik={formik}
                    readOnly={readOnly}

                  />
                )}
             {fieldHidden &&(
          <CustomTextField
                    id={"Account_Email_ForgetPass"}
                    name={"Account_Email_ForgetPass"}
                    placeholder={"abc@outlook.com"}
                    formik={formik}
                    readOnly={readOnly}
                  />
                )}
                {fieldHiddenForgotPass &&(
                    <CustomTextField
                    id={id}
                    name={name}
                    placeholder={Placeholder}
                    formik={formik}
                  />
                )}
                  {fieldHidden && fieldHiddenForgotPass &&(
                    <CustomTextField
                    id={"Account_Password_newPassword"}
                    name={"Account_Password_newPassword"}
                    placeholder={"Enter New Password"}
                    formik={formik}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      style: { height: "40px",color:"#253858",backgroundColor:"#ffffff",padding:"10px",borderRadius:"5px"},
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeSlash fill="#253858" /> : <Eye fill="#253858"/>}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  />
                  )}
          </Stack>
        </div>
        {fieldHiddenForgotPass &&(
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:"10px",color:"#253858 !important"}}>
        {disabled &&(
                      <Typography display={"flex"} alignItems={"center"} sx={{color:"#253858"}}>00:{timerText}</Typography>
                   )}
          <CustomButton 
           type="button"
            variant="text"  
            disabled={disabled}   
            sx={{
            color: `#253858 !important`,
            cursor:"pointer",
            textTransform: "none",
            paddingRight:"0px",
            "&:hover": {
              color:`#212d4187`, // Set your desired hover color here
              backgroundColor:"transparent"
            },
          }}
          onClick={()=>{
              onResendOtp();
          }}>
            {closeText}
          </CustomButton>
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{width:"96%",marginLeft:"10px",marginBottom:"10px",marginTop:"5px"}}>
        <div style={centerButtonStyle}>
          <CustomButton 
           type="button"
            variant="contained"      
            fullWidth
            sx={{
            backgroundColor:`${colors.blue[500]}`,
            color: `${colors.white[100]}`,
            marginTop:"0px !important",
            fontSize: "16px", // Set your desired font size here
            fontWeight: 700, // Set your desired font weight here
            textTransform: "none",
            "&:hover": {
              backgroundColor:`${colors.blue[400]}`, // Set your desired hover color here
            },
          }}
          onClick={
            SubmitOnClick
}>
            {oktext}
          </CustomButton>              
        </div>
      </DialogActions>
    </Dialog>
    </ThemeProvider>
  );
};

export default ConfirmationDialogComponent;


