export const msalConfig = {
  auth: {
    clientId: '7a9d0fd5-0e7c-4442-b5c9-b601a1dda323',
    authority: 'https://login.microsoftonline.com/4eb3d202-86fa-4a81-b4de-47e3389ef4d0',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [
    'User.Read',
    'Organization.Read.All',
    'Directory.Read.All',
    'Organization.ReadWrite.All',
    'Directory.ReadWrite.All'
  ]
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphUsersEndpoint: 'https://graph.microsoft.com/v1.0/users',
  graphLicensesEndpoint: 'https://graph.microsoft.com/v1.0/subscribedSkus'
}; 