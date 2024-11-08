import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const PreviewDocument: React.FC<any> = ({ formik, isOpen, onPreview }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onPreview}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{formik.values.HRL_DocumentName}</DialogTitle>
      <DialogContent>
        <iframe
          src={formik.values.ServerRedirectedEmbedUrl}
          width="100%"
          height="800px"
          style={{ border: 0 }}
          role="presentation"
        />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDocument;