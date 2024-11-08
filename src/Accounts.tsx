import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { IAccountsProps } from "./IAccountsProps";
import { ColorModeContext, ColorModeContextProps, createAppTheme } from "./theme";
import "./index.css";
import detectBrowserLanguage from 'detect-browser-language';
import { DocumentService } from "./services/Business/DocumentService";
import { DataProvider } from "./context/DataContext";
import ParentComponent from "./App";
import _ from 'lodash';

export default class Accounts extends Component<IAccountsProps, any> {
  private colorMode: ColorModeContextProps;

  constructor(props) {
    super(props);

    this.state = {
      isConfigLoaded: false,
      mode: 'dark',
      theme: createAppTheme('dark'),
      userLanguage: undefined,
    };

    this.colorMode = {
      toggleColorMode: this.toggleColorMode,
    };
  }

  public async componentDidMount() {
    const userLanguage = detectBrowserLanguage();

    try {
      await Promise.all([
        DocumentService.getInstance().ApiService.loadlocalizeConfig(),
        DocumentService.getInstance().ApiService.validateAccessToken(),
        DocumentService.getInstance().setBrowserLangConfigValue(userLanguage),
        DocumentService.getInstance().getUserRoles(),
      ]);

      this.setState({ userLanguage, isConfigLoaded: true });
    } catch (error) {
      console.error("Error during componentDidMount:", error);
      // Handle errors as needed
    }
  }

  // Debounced toggleColorMode to prevent frequent re-renders
  private toggleColorMode = _.debounce(() => {
    this.setState((prevState) => {
      const newMode = prevState.mode === 'light' ? 'dark' : 'light';
      return {
        mode: newMode,
        theme: createAppTheme(newMode),
      };
    });
  }, 300);  // Adjust debounce delay as necessary

  public render(): React.ReactElement<IAccountsProps> {
    const { theme, isConfigLoaded } = this.state;

    return isConfigLoaded ? (
      <DataProvider>
        <ColorModeContext.Provider value={this.colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <ParentComponent />
            </Router>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </DataProvider>
    ) : null;
  }
}
