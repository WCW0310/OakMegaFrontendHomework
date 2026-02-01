import { useState, useEffect, useRef } from "react";
import type { UserProfile } from "../types";
import { parseJwt } from "../utils/jwt";

// Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const FB_APP_ID = import.meta.env.VITE_FB_APP_ID || "";

export function useSocialAuth() {
  // 1. User State Management
  // Initialize from localStorage to persist session across reloads
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem("user_profile");
      return savedUser ? JSON.parse(savedUser) : {};
    } catch (error) {
      console.error("Failed to parse user profile from storage", error);
      return {};
    }
  });

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // 2. Initialize Google Identity Services (GIS)
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
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
        use_fedcm_for_prompt: true,
      });

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
        });
      }
    };

    // Check if script already exists
    const id = "google-jssdk";
    const existingScript = document.getElementById(id);

    if (existingScript) {
      // If script exists, just initialize (or wait if it's still loading - though simplistic check here assumes loaded if exists, better is to check window.google)
      if (window.google) {
        initGoogle();
      } else {
        // Edge case: script tag exists but not loaded.
        // We can attach onload to existing script if we want to be safe,
        // but typically if it exists it likely loaded or is loading.
        existingScript.addEventListener("load", initGoogle);
        return () => existingScript.removeEventListener("load", initGoogle);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;

    document.body.appendChild(script);
  }, []);

  // 3. Initialize Facebook JavaScript SDK
  useEffect(() => {
    // Setup async init function
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v24.0",
      });
    };

    // Load SDK script if not already present
    const id = "facebook-jssdk";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onerror = () => {
        console.error(
          "Facebook SDK failed to load. Likely blocked by browser.",
        );
        // We can set a flag here if we want to show a UI warning immediately,
        // but for now we'll handle it on click.
      };
      document.body.appendChild(script);
    }
  }, []);

  // 4. Action Handlers

  const handleFBLogin = () => {
    if (!window.FB) {
      alert(
        "無法載入 Facebook 登入功能。\n\n如果您使用 Edge 瀏覽器或安裝了廣告阻擋器，請嘗試：\n1. 關閉「追蹤防護」或將本站加入白名單。\n2. 暫時關閉廣告阻擋插件。\n3. 改用 Chrome 或 Safari 瀏覽器。",
      );
      console.warn("Facebook SDK not loaded yet or blocked.");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          // Fetch user details upon successful authorization
          window.FB.api("/me", { fields: "name, picture" }, (userInfo) => {
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
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile" },
    );
  };

  const handleLogout = () => {
    setUser({});
    localStorage.removeItem("user_profile");
    // Force reload to clear any SDK states/caches
    window.location.reload();
  };

  return { user, handleFBLogin, handleLogout, googleBtnRef };
}
