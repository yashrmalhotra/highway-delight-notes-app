import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const useGoogleIdentify = (props: any) => {
  const url = "https://accounts.google.com/gsi/client";
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { nextAuthOpt, googleOpt } = props || {};
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session) {
      setIsSignedIn(true);
    }
  }, [session]);
  useEffect(() => {
    if ((!isLoading && isSignedIn) || pathname === "/signup") return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (response?.credential) {
              setIsLoading(true);
              const res = await signIn("googleonetap", {
                credential: response.credential,
                redirect: false,
                ...nextAuthOpt,
              });
              setIsLoading(false);

              if (!res?.ok) {
                console.log("res.error", res?.error);
                if (res?.error === "User not found") {
                  alert("Please sign up first");
                  router.replace("/signup");
                }
              } else {
                console.log("Login successful", res);
                router.replace("/");
              }
            } else {
              console.warn("No credential returned");
            }
          },
          ...googleOpt,
        });

        if (googleOpt?.isOneTap) {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
              console.log("Prompt not displayed:", notification.getNotDisplayedReason());
            } else if (notification.isSkippedMoment()) {
              console.log("Prompt skipped:", notification.getSkippedReason());
            } else if (notification.isDismissedMoment()) {
              console.log("Prompt dismissed:", notification.getDismissedReason());
            }
          });
        }
      }
    };

    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isLoading, isSignedIn, googleOpt, nextAuthOpt]);

  return { isLoading, isSignedIn };
};

export default useGoogleIdentify;
