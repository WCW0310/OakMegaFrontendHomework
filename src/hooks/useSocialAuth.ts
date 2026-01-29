import { useState, useEffect } from "react";
import type { UserProfile } from "../types";
import { parseJwt } from "../utils/jwt";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const FB_APP_ID = import.meta.env.VITE_FB_APP_ID || "";

export function useSocialAuth() {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem("user_profile");
      return savedUser ? JSON.parse(savedUser) : {};
    } catch (error) {
      console.error("讀取登入狀態失敗", error);
      return {};
    }
  });

  const handleLogout = () => {
    setUser({});
    localStorage.removeItem("user_profile");
    window.location.reload();
  };

  // 初始化 Google SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: GoogleCredentialResponse) => {
            const payload = parseJwt(response.credential);
            setUser((prev) => {
              const newUser = {
                ...prev,
                google: {
                  name: payload.name,
                  picture: payload.picture,
                  email: payload.email,
                },
              };
              localStorage.setItem("user_profile", JSON.stringify(newUser));
              return newUser;
            });
          },
        });

        const btnParent = document.getElementById("googleBtn");
        if (btnParent) {
          window.google.accounts.id.renderButton(btnParent, {
            theme: "outline",
            size: "large",
          });
        }
      }
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 初始化 Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    const id = "facebook-jssdk";
    if (!document.getElementById(id)) {
      const js = document.createElement("script") as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(js);
    }
  }, []);

  // FB 登入動作
  const handleFBLogin = () => {
    if (!window.FB) return;

    window.FB.login(
      (response: FbLoginResponse) => {
        if (response.authResponse) {
          window.FB.api(
            "/me",
            { fields: "name, picture" },
            (userInfo: FbUserInfoResponse) => {
              setUser((prev) => {
                const newUser = {
                  ...prev,
                  facebook: {
                    name: userInfo.name,
                    picture: userInfo.picture.data.url,
                    id: userInfo.id,
                  },
                };
                localStorage.setItem("user_profile", JSON.stringify(newUser));
                return newUser;
              });
            },
          );
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile" },
    );
  };

  return { user, handleFBLogin, handleLogout };
}
