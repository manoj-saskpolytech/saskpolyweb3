import * as React from "react";
import { DocumentService } from "../../services/Business/DocumentService";
import { useContext, useEffect, useMemo } from "react";
import CustomDropdown from "../CustomDropdown/index";
import { useFormik } from "formik";
import { DataContext } from "../../context/DataContext";
import { Stack } from '@mui/material';
import { Globe } from '@phosphor-icons/react';
import Cookies from 'js-cookie';

const CustomDropdownLanguageSwitch = () => {
  const { dataStore, setData } = useContext(DataContext);

  // Set initial language based on browser settings
  const initialLang = useMemo(() => {
    const defaultLang = DocumentService.getBrowserLangConfigValue();
    return (defaultLang === "es" || defaultLang === "zh-CN") ? defaultLang : "en-US";
  }, []);

  const formik = useFormik({
    initialValues: {
      FSI_Loc_Language: initialLang,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const langtypeoptions = useMemo(() => [
    { key: "en-US", text: "English (US)" },
    { key: "es", text: "Español" },
    { key: "zh-CN", text: "中文 (简体)" },
  ], []);

  useEffect(() => {
    const loadData = async () => {
      if (!formik.values.FSI_Loc_Language) return;

      const isProduction = window.location.hostname !== 'localhost' && !/^192\.168\./.test(window.location.hostname);
      const cookieDomain = isProduction ? '.proxikle.xyz' : window.location.hostname;

      const selectedBrowserLang = await DocumentService.getInstance().setBrowserLangConfigValue(formik.values.FSI_Loc_Language);
      
      if (!dataStore.Language || dataStore.Language !== selectedBrowserLang.Language) {
        setData("Language", selectedBrowserLang.Language);
        Cookies.set("BrowserLangConfig", selectedBrowserLang.Language, { secure: false, sameSite: "No", domain: cookieDomain, path: '/' });
      }
    };

    loadData();
  }, [formik.values.FSI_Loc_Language, dataStore.Language, setData]);

  return (
    <Stack direction={"row"} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
      <Globe size={34} color={`#253858`} />
      <CustomDropdown
        id="FSI_Loc_Language"
        defaultSelectedKey={initialLang}
        options={langtypeoptions}
        formik={formik}
        menuProps={{
          PaperProps: {
            sx: {
              background: 'linear-gradient(118deg, #f8d9c3 0%, #f6e2b7 35%, #acf4e7 73%, #96ddf6 100%)',
              color: "#253858",
              backdropFilter: 'blur(15px)',
              padding: '0px !important',
              '& .MuiMenuItem-root': {
                '&:hover': {
                  backgroundColor: '#a38d8d9c',
                  color: '#253858',
                },
                '&.Mui-selected': {
                  backgroundColor: '#c29e9e54',
                  color: '#253858',
                  '&:hover': {
                    backgroundColor: '#a38d8d9c',
                    color: '#253858',
                  },
                },
              },
            },
          },
          MenuListProps: {
            style: {
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        }}
        selectSx={{
          color: "#253858",
          height: "40px",
          fontWeight: "600",
          marginTop: "2px",
          ".MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          '.MuiSelect-select': {
            padding: '0px !important',
          },
          '.MuiSelect-icon': {
            display: 'none',
          },
          '.MuiOutlinedInput-root': {
            minHeight: 'unset',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
          },
          '& .MuiMenuItem-root': {
            borderBottom: 'none',
            padding: '0px !important',
          },
        }}
      />
    </Stack>
  );
};

export default CustomDropdownLanguageSwitch;
