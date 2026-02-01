/// <reference types="vite/client" />

// Note: Do not use export or import here, otherwise it becomes a module instead of a global declaration

// 1. Define Google response structure
interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

// 2. Define FB login response status
interface FbLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  } | null;
}

// 3. Define FB user data (Graph API)
interface FbUserInfoResponse {
  name: string;
  id: string;
  picture: {
    data: {
      url: string;
      height: number;
      width: number;
      is_silhouette: boolean;
    };
  };
}

// 4. Extend Global Window Object
interface Window {
  // Google SDK
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
          use_fedcm_for_prompt: boolean;
        }) => void;
        renderButton: (
          parent: HTMLElement | null,
          options: { theme: string; size: string },
        ) => void;
      };
    };
  };

  // Facebook SDK
  fbAsyncInit: () => void;
  FB: {
    init: (params: {
      appId: string;
      cookie: boolean;
      xfbml: boolean;
      version: string;
    }) => void;
    login: (
      callback: (response: FbLoginResponse) => void,
      options?: { scope: string },
    ) => void;
    api: (
      path: string,
      params: { fields: string },
      callback: (response: FbUserInfoResponse) => void,
    ) => void;
  };
}
