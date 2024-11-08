import '../../index.css'; // You can use a separate CSS file for styling
import { ThemeProvider } from "@mui/material/styles";
import {useTheme} from "@mui/material";
import {Warning } from "@phosphor-icons/react"
import { useLocation } from "react-router-dom";
import { DocumentService } from '../../services/Business/DocumentService';
const Banner = () => {
    const theme = useTheme();
    const currentlocation = useLocation();
    const pathname = currentlocation.pathname;

    let BannerVisible;
    switch (pathname) {
      case "/Home":
        BannerVisible = false;
        break;
      default:
        BannerVisible = true;
    }

  return BannerVisible?(
    <ThemeProvider theme={theme}>
    <div className="bannerstyle">
      <p style={{display:"flex",alignItems:"center"}}>
     <Warning className="warningicon" weight="fill"/>&nbsp;{DocumentService.getLocValueByKey("beta_banner","This app is currently in beta. Do not include any …formation or production grade emails & passwords.")}
      </p>
    </div>
    </ThemeProvider>
  ):(
    null
  );
};

export default Banner;
