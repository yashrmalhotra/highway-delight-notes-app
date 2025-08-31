import React from "react";
import SignIn from "../components/SignIn";
import { Metadata } from "next";

const page = () => {
  return <SignIn />;
};
export const metadata: Metadata = {
  title: "Sign in - Highway Delite",
};
export default page;
