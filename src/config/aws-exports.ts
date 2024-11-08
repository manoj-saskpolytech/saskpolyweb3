const awsconfig = {
  Auth: {
    Cognito: {
      region:'us-east-2',
      userPoolClientId: process.env.React_APP_USER_POOL_CLIENT_ID,
      userPoolId: process.env.React_APP_USER_POOL_ID,
      mandatorySignIn: true,
      loginWith: {
        oauth: {
          domain:
            'abcdefghij1234567890-29051e27.auth.us-east-1.amazoncognito.com',
          scopes: [
            'openid email phone profile aws.cognito.signin.user.admin ',
          ],
          redirectSignIn: [
            "https://*.proxikle.xyz",
            "http://localhost:3000/",
            "http://localhost:3001/",
        ],
        redirectSignOut: [
            "https://*.proxikle.xyz/",
            "http://localhost:3000/",
            "http://localhost:3001/",
        ],
        responseType: "code",        
    },
        username: true,
        email: false,
        phone: false,
      },
    },
    },
  };
  
  export default awsconfig;
  