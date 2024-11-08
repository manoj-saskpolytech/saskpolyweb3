import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  IconButton,
  Avatar,
  useTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from "@mui/material";
import AvatarEditor from 'react-avatar-edit';
import Avatar_logo from "../../assets/Avatar.png";
import { Pencil } from "@phosphor-icons/react";
import { generateTokens } from "../../theme";
// import B2 from 'backblaze-b2';
// import axios from 'axios';

const FileUpload = (props) => {
  // const { id, formik, fieldName } = props;
  const theme = useTheme();
  const colors = generateTokens(theme.palette.mode);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [preview, setPreview] = useState("");
  const [src, setSrc] = useState("");

  // const b2 = new B2({
  //   applicationKeyId: '005728976e246360000000001',
  //   applicationKey: 'K005AzZPtSUtc/vVXRq+vgDfn+BBx6s'
  // });

  const { getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSrc(reader.result as string);
      };
    },
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"],
    },
  });

  const handleSaveAvatar = async () => {
    setSrc(preview);
    setShowAvatarEditor(false);
    // const blob = await fetch(preview).then(res => res.blob());
    // const fileName = `${id}-avatar.png`;

    // try {
    //   const response = await uploadFileToB2(blob, fileName);
    //   console.log('File uploaded successfully:', response);
    //   formik.setFieldValue(fieldName, response.data.url); // Assuming the response contains the file URL
    // } catch (error) {
    //   console.error('Error uploading file:', error);
    // }
  };

  const uploadFileToB2 = async (file, fileName) => {
    // try {
      // await b2.authorize();
      // const uploadUrlResponse = 
      // await b2.getUploadUrl({
      //   bucketId: '1772b8a957865e3294060316'
      // });

      // const uploadResponse = await axios.post(uploadUrlResponse.data.uploadUrl, file, {
      //   headers: {
      //     Authorization: uploadUrlResponse.data.authorizationToken,
      //     'X-Bz-File-Name': fileName,
      //     'Content-Type': 'b2/x-auto',
      //     'X-Bz-Content-Sha1': 'do_not_verify',
      //   },
      //   onUploadProgress: event => {
      //     console.log(`Upload progress: ${event.loaded} / ${event.total}`);
      //   }
      // });

      // return uploadResponse;
    // } catch (error) {
    //   console.error('Error during B2 upload:', error);
    //   throw error;
    // }
  };

  const handleAvatarEditClick = () => {
    setShowAvatarEditor(true);
  };

  const onClose = () => {
    setPreview("");
  };

  const onCrop = (view) => {
    setPreview(view);
  };


  return (
    <ThemeProvider theme={theme}>
      <Box width="100%">
        <Box position="relative" display="inline-block" width={100} height={100} marginTop="2%" marginBottom="2%">
          <Avatar
            src={src || Avatar_logo}
            alt="User Image Not Found"
            sx={{
              width: 100,
              height: 100,
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: colors.white[300],
              color: "black",
              '&:hover': {
                backgroundColor: colors.white[400],
              },
            }}
            onClick={handleAvatarEditClick}
          >
            <Pencil size={18} />
          </IconButton>
        </Box>
        <Dialog
          sx={{
            borderRadius: '10px !important',
            '.MuiPaper-root': {
              animation: 'slide-in 0.5s ease-in-out',
            },
          }}
          open={showAvatarEditor}
          onClose={(event, reason) => {
            if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
              setShowAvatarEditor(false);
            }
          }}
        >
          <DialogTitle fontSize={18} sx={{padding:"15px 15px 0px 15px !important",backgroundColor: `${colors.mainblack[950]} !important` }}>Edit Avatar</DialogTitle>
          <DialogContent sx={{padding:"15px 15px !important",backgroundColor: `${colors.mainblack[950]} !important` }}>
            <AvatarEditor
              {...getInputProps()}
              width={390}
              height={295}
              onCrop={onCrop}
              onClose={onClose}
              labelStyle={{ color: colors.white[100] }} 
              src={src}
            />
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: `${colors.mainblack[950]} !important` ,
            }}
          >
            <Button
              onClick={() => setShowAvatarEditor(false)}
              sx={{
                color:colors.white[100],
                marginBottom:"5px",
                backgroundColor: `${colors.blue[500]}`,
                "&:hover": {
                  backgroundColor: `${colors.blue[400]}`,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAvatar}
              sx={{
                marginRight: '10px',
                marginBottom:"5px",
                color:colors.white[100],
                backgroundColor: `${colors.blue[500]}`,
                "&:hover": {
                  backgroundColor: `${colors.blue[400]}`,
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default FileUpload;
