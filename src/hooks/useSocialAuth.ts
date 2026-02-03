import { useState, useEffect, useRef } from "react";
import type { UserProfile } from "../types";
import { parseJwt } from "../utils/jwt";
import { getFbExpiration } from "../utils/url";

// Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const FB_APP_ID = import.meta.env.VITE_FB_APP_ID || "";

export function useSocialAuth() {
  // 1. User State Management
  // Initialize from localStorage to persist session across reloads
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem("user_profile");
      if (!savedUser) return {};

      const parsedUser = JSON.parse(savedUser);

      // Security Check: If the session is already expired during initialization,
      // invalidate it immediately to prevent UI flashing (e.g., avatar appearing briefly).
      if (parsedUser.exp && Date.now() >= parsedUser.exp * 1000) {
        console.warn("Storage session expired. Resetting.");
        localStorage.removeItem("user_profile");
        return {};
      }

      return parsedUser;
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
            const newUser: UserProfile = {
              ...prev,
              google: {
                name: payload.name,
                picture: payload.picture,
              },
              // Store expiration time (exp is in seconds)
              exp: payload.exp,
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
              // Get FB expiration from picture URL
              const fbExp = getFbExpiration(userInfo.picture.data.url);

              // Compare with existing expiration (if any) and take the smaller one
              // Logic:
              // 1. If both exist, take min
              // 2. If only one exists, take it
              // 3. If neither, undefined (though google should usually have it)

              let finalExp = prev.exp;
              if (fbExp) {
                if (finalExp) {
                  finalExp = Math.min(finalExp, fbExp);
                } else {
                  finalExp = fbExp;
                }
              }

              const newUser: UserProfile = {
                ...prev,
                facebook: {
                  name: userInfo.name,
                  picture: userInfo.picture.data.url,
                },
                exp: finalExp,
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

  // 5. Auto Logout Check
  useEffect(() => {
    if (!user.exp) return;

    const checkExpiration = () => {
      // exp is in seconds, Date.now() is in ms
      if (Date.now() >= user.exp! * 1000) {
        console.warn("Session expired. Logging out...");
        handleLogout();
      }
    };

    // Check immediately on mount/update
    checkExpiration();

    // Check periodically (e.g., every minute) just in case
    const intervalId = setInterval(checkExpiration, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [user.exp]);

  return { user, handleFBLogin, handleLogout, googleBtnRef };
}
