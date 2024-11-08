// theme.ts
import { createContext, useState, useMemo } from "react";
import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";

// Define the shape of the color tokens
interface ColorTokens {
  [key: string]: {
    [key: number]: string;
  };
}

// Define PaletteMode as a union type
type PaletteMode = 'light' | 'dark';

// Generate color tokens based on the mode
export const generateTokens = (mode: PaletteMode): ColorTokens => ({
  ...(mode === "dark"
    ? {
        sideblack: {
          100: "#d1d1d1",
          200: "#a2a2a2",
          300: "#747474",
          400: "#454545",
          500: "#171717",
          600: "#121212",
          700: "#0e0e0e",
          800: "#090909",
          900: "#050505",
          950: "#1e1f25",
        },
        mainblack: {
          100: "#cfcfcf",
          200: "#a0a0a0",
          300: "#707070",
          400: "#414141",
          500: "#111111",
          600: "#0e0e0e",
          700: "#0a0a0a",
          800: "#070707",
          900: "#030303",
          950: "#0f1015",
        },
        blue: {
          100: "#cceffc",
          200: "#99dff9",
          300: "#66cef5",
          400: "#33bef2",
          500: "#00aeef",
          600: "#008bbf",
          700: "#00688f",
          800: "#004660",
          900: "#002330",
        },
        labelblue: {
          100: "#cfdade",
          200: "#9fb4bc",
          300: "#708f9b",
          400: "#406979",
          500: "#104458",
          600: "#0d3646",
          700: "#0a2935",
          800: "#061b23",
          900: "#030e12",
        },
        white: {
          100: "#ffffff",
          200: "#fefefe",
          300: "#cbcbcb",
          400: "#989898",
          500: "#666666",
          600: "#333333"
        }
      }
    : {}),
});

// Generate theme settings based on the mode
export const themeSettings = (mode: PaletteMode): ThemeOptions => {
  const colors = generateTokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.mainblack[500],
            },
            secondary: {
              main: colors.sideblack[500],
            },
            neutral: {
              dark: colors.white[700],
              main: colors.white[500],
              light: colors.white[100],
            },
            background: {
              default: colors.mainblack[500],
            },
          }
        : {
            primary: {
              main: colors.mainblack[500],
            },
            secondary: {
              main: colors.sideblack[500],
            },
            neutral: {
              dark: colors.white[700],
              main: colors.white[500],
              light: colors.white[100],
            },
            background: {
              default: colors.white[500],
            },
          }),
    },
    typography: {
      fontFamily: ["Metropolis", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// Create and export the ColorModeContext
export interface ColorModeContextProps {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextProps>({
  toggleColorMode: () => {},
});

// Create and export the createColorMode function
export const createColorMode = (setMode: React.Dispatch<React.SetStateAction<PaletteMode>>): ColorModeContextProps => ({
  toggleColorMode: () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  },
});

// Create and export the createAppTheme function
export const createAppTheme = (mode: PaletteMode): Theme => createTheme(themeSettings(mode));

// Export the useMode hook for functional components
export const useMode = (): [Theme, ColorModeContextProps] => {
  const [mode, setMode] = useState<PaletteMode>("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
