let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const getToken = async (getAccessTokenSilently: any) => {
  if (accessToken) return accessToken;

  if (!refreshPromise) {
    refreshPromise = getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email read:quiz write:quiz",
      },
    }).then((token : any) => {
      accessToken = token;
      refreshPromise = null;
      return token;
    }).catch((error : any) => {
      refreshPromise = null;
      throw error;
    });
  }

  return refreshPromise;
};

export const clearToken = () => {
  accessToken = null;
};
