/// <reference types="vite/client" />

// ⚠️ 注意：這裡不要寫 export，也不要寫 import，這樣才會變成全域宣告

// 1. 定義 Google 回傳的資料結構
interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

// 2. 定義 FB 登入回傳的狀態
interface FbLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  } | null;
}

// 3. 定義 FB 使用者資料 (Graph API)
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

// 4. 擴充全域 Window 物件
interface Window {
  // Google SDK
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
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
