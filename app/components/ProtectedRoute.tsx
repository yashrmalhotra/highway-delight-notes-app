"use client";
import React, { useEffect } from "react";
import { useAuthContext } from "../context/AuthContextProvider";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { email, status } = useAuthContext()!;
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status]);
  console.log(status);
  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress size="50px" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
