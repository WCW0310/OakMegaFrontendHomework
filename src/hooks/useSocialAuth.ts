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
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google) return;

      // Initialize the client
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
        // [Important] Enable FedCM to prevent browser blocking (Chrome/Edge)
        use_fedcm_for_prompt: true,
      });

      // Render the button if the container exists
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup script on unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 3. Initialize Facebook JavaScript SDK
  useEffect(() => {
    // Setup async init function
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    // Load SDK script if not already present
    const id = "facebook-jssdk";
    if (!document.getElementById(id)) {
      const js = document.createElement("script") as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(js);
    }
  }, []);

  // 4. Action Handlers

  const handleFBLogin = () => {
    if (!window.FB) {
      console.warn("Facebook SDK not loaded yet.");
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
