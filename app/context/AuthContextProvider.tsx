"use client";
import { ContextValueTypes } from "@/types/types";
import { useSession } from "next-auth/react";
import useGoogleIdentify from "../components/GoogleOneTap";
import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext<ContextValueTypes | null>(null);
const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const googleOpt = {
    prompt_parent_id: "oneTap",
    isOneTap: true,
  };
  const nextAuthOpt = {
    redirect: false,
  };
  const { isSignedIn } = useGoogleIdentify({
    nextAuthOpt,
    googleOpt,
  });
  return <AuthContext.Provider value={{ email: session?.user?.email, status, name: session?.user?.name }}>{children}</AuthContext.Provider>;
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
export default AuthContextProvider;
