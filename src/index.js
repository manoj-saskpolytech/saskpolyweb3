// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Accounts from "./Accounts";
import { Amplify } from "aws-amplify";
import awsconfig from "./config/aws-exports";


// Configure Amplify
Amplify.configure(awsconfig);

// Create root element and render the Accounts component
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <>
    <Accounts />
  </>
);
