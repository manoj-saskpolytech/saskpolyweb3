import React, { useEffect, useState ,MouseEvent} from 'react';
import { Container, Box, Typography, Button, Card, CardContent, Stack, Avatar ,Popover, IconButton, CardHeader} from '@mui/material';
import { SignOut,CaretDoubleRight } from '@phosphor-icons/react';
import { useNavigate } from "react-router-dom";
import { DocumentService } from '../../services/Business/DocumentService';
import { ApiService } from '../../services/ApiService/ApiService';
import CustomDropdownLanguageSwitch from '../../controls/CustomDropdownLanguageSwitch';


const HomePage: React.FC = () => {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(popoverAnchorEl);
  const id = open ? 'simple-popover' : undefined;
  const navigate = useNavigate();

  const generateLocalizationMsg = (Key: string,defaulValue:string) => {
    return DocumentService.getLocValueByKey(
      Key,
      defaulValue
    );
  };

const userInfo=DocumentService.getCurrentUserInfo();

const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
  setPopoverAnchorEl(event.currentTarget);
};

const handlePopoverClose = () => {
  setPopoverAnchorEl(null);
};

   useEffect(() => {
      const getUserRoles = async () => {
        try {
         await DocumentService.getInstance().getUserRoles();
        } catch (error) {
          console.error("An error occurred: when getting the user role", error);
          // Handle the error as needed
        }
      };
      getUserRoles();
    }, []);

const logoutCurrentUser = async () => {
  try {
    await ApiService.logout();
    navigate("/SignIn");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const handleLaunchClick = async (type) => {
  if(type==="Analytics"){
  // window.location.href = 'http://192.168.170.69:3001';
  window.location.href = 'https://analytics.proxikle.xyz/';
  }else if(type==="Explorer"){
    window.location.href = 'https://explorer.proxikle.xyz/';
  }

};


  return (
    <Container  sx={{ height:"100vh",maxWidth:"100% !important",minWidth:"200px" }} className='mainForm'>
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
              width:"80%",
            }}
          >
            <img
              src="../../public/logo.png"
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
          <CustomDropdownLanguageSwitch />
          <Box className="SignInHeaderRightStyle">
          <IconButton onClick={handleAvatarClick}>
            <Avatar src="https://proxiklestatic.com/products/accounts/user_icon.svg" alt="User Image Not Found" />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={popoverAnchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                width: '19%', // Adjust the width as needed
                minWidth: "316px !important",
                height: "22%",
                minHeight: "160px !important",
                marginTop:"0.5%",
                background: 'linear-gradient(118deg, #fff4ed 0%, #ffecc4 35%,#dbfff9 73%,#ffe7e7 100%)'
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} p={2.5}>
              <Avatar src="https://proxiklestatic.com/products/accounts/user_icon.svg" alt="User Image Not Found" sx={{ width: 65, height: 65 }} />
              <Stack>
                <Typography variant="h4" sx={{ fontWeight: 600,color:"#253858" }}>{userInfo.firstName} {userInfo.lastName}</Typography>
                <Typography variant="body2" color="#253858">{userInfo.currentuserEmail}</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75em', color: 'gray' }}>
                  {}
                </Typography>
              </Stack>
            </Stack>
            <Box mt={1} display="flex" justifyContent="center" gap={2} px={2}>
              <Box sx={{ width: "50%", display: "flex", justifyContent: "center",borderRadius:"5px" , "&:hover": {
                    backgroundColor:"transparent", // Hover color for My Account button
                  }, }}>
                <Button variant="text" startIcon={<SignOut style={{ width: 20, height: 20, background: "none", color:"#253858" }} />}
                  sx={{ textTransform: "none", color:"#253858","&:hover": {
                    backgroundColor:'"#87cbe421"', // Hover color for My Account button
                  },}} onClick={()=>{logoutCurrentUser()}}>
                  {generateLocalizationMsg( "logout_account","Logout")}
                </Button>
              </Box>
            </Box>
          </Popover>
          </Box>
        </Stack>
      <Stack direction="row" spacing={3} sx={{ mt: 5,justifyContent:"center",alignItems:"center" }}>
        <Card sx={{ minWidth:"25%",width:"25%",backgroundColor:"#fff",boxShadow:"none"}}>
        <CardHeader
          sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",padding:"16px 0px 10px 16px" ,marginTop:"10px"}}
          title={
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center"}}>
              <img src="https://proxiklestatic.com/products/accounts/analytics_accounts_logo.svg" alt="Analytics Icon" style={{ width: '35px' }} />
            </Typography>
          }
          action={
            <Box 
            sx={{ 
              background: 'linear-gradient(118deg, #00AEEF 0%, #015BCB 100%)', 
              color: '#fff', 
              padding: '6px 20px', 
              borderRadius: '4px', 
              display: 'flex', 
              alignItems: 'center',
              marginTop:"5px"
            }}
          >
            <b>{generateLocalizationMsg("beta","Beta")}</b>
          </Box>
          }
        />
          <CardContent sx={{padding:"0px 16px 16px 16px"}}>
          <Typography color="#253858" fontWeight={600} fontSize={20}>
              {generateLocalizationMsg("analytics_title","Analytics")}
            </Typography>
            <Typography color="#253858" marginTop={"10px"} fontSize={14}>
              {generateLocalizationMsg("analytics","Layer 1 Blockchain Analytics Service")}
            </Typography>
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center",justifyContent:"flex-end",marginTop:"30px",}}>
            <Button size="medium" sx={{color:"#00AEEF",'&:hover':{
              backgroundColor:"#87cbe421"
            }}}endIcon={<CaretDoubleRight fill='#00AEEF' />}  onClick={()=>{handleLaunchClick("Analytics")}}>{generateLocalizationMsg("launch","Launch")}</Button>
            </Typography>
           
          </CardContent>
        </Card>
        <Card sx={{ minWidth:"25%",width:"25%",backgroundColor:"#fff",boxShadow:"none"}}>
        <CardHeader
          sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",padding:"16px 0px 10px 16px" ,marginTop:"10px"}}
          title={
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center"}}>
              <img src="https://proxiklestatic.com/products/accounts/explorer_accounts_logo.svg"alt="Explorer Icon" style={{ width: '35px' }} />
            </Typography>
          }
          action={
            <Box 
            sx={{ 
              background: 'linear-gradient(118deg, #F0AF20 0%, #FD7B1D 100%)', 
              color: '#fff', 
              padding: '6px 20px', 
              borderRadius: '4px', 
              display: 'flex', 
              alignItems: 'center',
              marginTop:"5px"
            }}
          >
            <b>{generateLocalizationMsg("pre_alpha","Pre-Alpha")}</b>
          </Box>
          }
        />
          <CardContent sx={{padding:"0px 16px 16px 16px"}}>
          <Typography color="#253858" fontWeight={600} fontSize={20}>
          {generateLocalizationMsg("explorer_Title","Explorer")}
            </Typography>
            <Typography color="#253858" marginTop={"10px"} fontSize={14} height={"40px"}>
            {generateLocalizationMsg("explorer","Track & Analyze transactions with Explorer Service")}
            </Typography>
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center",justifyContent:"flex-end",marginTop:"10px",}}>
            <Button size="medium" 
            // disabled
           sx={{
            color: "#00AEEF",
            '&:hover': {
              backgroundColor: "#87cbe421",
            },
            '&:disabled': {
              color: "#b2c1c6 !important"
            }
          }}
            endIcon={<CaretDoubleRight fill='#b2c1c6' />} onClick={()=>{handleLaunchClick("Explorer")}} >{generateLocalizationMsg("launch","Launch")}</Button>
            </Typography>
           
          </CardContent>
        </Card>
        <Card sx={{ minWidth:"25%",width:"25%",backgroundColor:"#fff",boxShadow:"none"}}>
        <CardHeader
          sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",padding:"16px 0px 10px 16px" ,marginTop:"10px"}}
          title={
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center"}}>
              <img src="https://proxiklestatic.com/products/accounts/nova_accounts_logo.svg" alt="Nova Icon" style={{ width: '25px' }} />
            </Typography>
          }
          action={
            <Box 
            sx={{ 
              background: 'linear-gradient(118deg, #F0AF20 0%, #FD7B1D 100%)', 
              color: '#fff', 
              padding: '6px 20px', 
              borderRadius: '4px', 
              display: 'flex', 
              alignItems: 'center',
              marginTop:"5px"
            }}
          >
            <b>{generateLocalizationMsg("pre_alpha","Pre-Alpha")}</b>
          </Box>
          }
        />
          <CardContent sx={{padding:"0px 16px 16px 16px"}}>
          <Typography color="#253858" fontWeight={600} fontSize={20}>
          {generateLocalizationMsg("nova_Title","Nova")}
            </Typography>
            <Typography color="#253858" marginTop={"10px"} fontSize={14}>
            {generateLocalizationMsg("nova","Query Blockchain data for faster analysis")}
            </Typography>
            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center",justifyContent:"flex-end",marginTop:"30px",}}>
            <Button size="medium" disabled 
            sx={{
              color: "#00AEEF",
              '&:hover': {
                backgroundColor: "#87cbe421",
              },
              '&:disabled': {
                color: "#b2c1c6 !important"
              }
            }}endIcon={<CaretDoubleRight fill='#b2c1c6' />}>{generateLocalizationMsg("launch","Launch")}</Button>
            </Typography>
           
          </CardContent>
        </Card>
      </Stack>
      <Typography
        variant="h5"
        sx={{ display: "flex", justifyContent: "center",alignItems:"end", marginTop: "20%" ,color:"#253858"}}
      >
        <b>&copy;{generateLocalizationMsg("footer","2024 Saskatchewan Polytechnic. All Rights Reserved")}</b>
      </Typography>
    </Container>
  );
};

export default HomePage;
