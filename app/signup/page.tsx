import React from "react";
import SignUp from "../components/SignUp";
import { Metadata } from "next";

const page = () => {
  return <SignUp />;
};
export const metadata: Metadata = {
  title: "Sign up - Highway Delite",
};
export default page;
