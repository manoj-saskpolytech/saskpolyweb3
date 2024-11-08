import  { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const DynamicTitleAndFavicon = () => {
  const location = useLocation();

  useEffect(() => {
    // Function to set the title and favicon dynamically
    const setTitleAndFavicon = () => {
      let title;
      let favicon:any;

      if (location.pathname === '/Home') {
        title = 'SaskPolyWeb3 Home';
        favicon = "../../public/favicon.jpg";
      } else if (location.pathname === '/SignIn') {
        title = 'Sign In to your SaskPolyWeb3 Account';
        favicon ="../../public/favicon.jpg";
      }
      else if (location.pathname === '/SignUp') {
        title = 'Create your SaskPolyWeb3 Account';
        favicon ="../../public/favicon.jpg";
      }else{
        title = 'SaskPolyWeb3 Account';
        favicon = '../../public/favicon.jpg';
      }
      // Add more conditions as needed

      // Update the document title
      document.title = title;

      // Update the favicon
      const link: HTMLLinkElement =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    };

    setTitleAndFavicon();
  }, [location]);

  return null;
};

export default DynamicTitleAndFavicon;
