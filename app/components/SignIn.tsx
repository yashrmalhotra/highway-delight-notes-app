"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button, TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/types/types";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatTimer } from "@/utills/utilityFunction";
type SignInFormData = z.infer<typeof SignInSchema>;

const SignIn = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpResendLogin, setIsOtpResendLogin] = useState(false);
  const [customError, setCustomErron] = useState<string>("");
  const [sec, setSec] = useState<number>(0);
  const [formatedTime, setFormatedTime] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const email = watch("email");
  useEffect(() => {
    if (sec === 0) {
      clearInterval(intervalRef.current!);
      setSec(120);
      intervalRef.current = null;
    } else {
      const formated = formatTimer(sec);
      setFormatedTime(formated);
    }
  }, [sec]);
  const onSubmit = async (data: SignInFormData) => {
    const res = await signIn("credentials", {
      email: data.email,
      otp: data.otp,
      redirect: false,
    });

    if (res?.error) {
      if (res?.error === "CredentialsSignin") {
        setError("root", {
          type: "Manual",
          message: "Email or OTP is invalid",
        });
        setIsLoading(false);
        return;
      } else {
        setError("root", {
          type: "Manual",
          message: res.error,
        });
        setIsLoading(false);
        return;
      }
    } else {
      router.replace("/");
    }
  };

  const handleGetOtp = async () => {
    const isValid = await trigger("email");
    setSec(120);
    if (isValid) {
      try {
        setIsLoading(true);
        await axios.post("/api/loginotp", { email });
        setOtpVisible(true);
      } catch (error: any) {
        setCustomErron(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const resendOTP = async () => {
    try {
      setIsOtpResendLogin(true);
      await axios.post("/api/loginotp", { email });
      setSec(120);
      intervalRef.current = setInterval(() => {
        setSec((prevSec) => prevSec - 1);
      }, 1000);
    } catch (error: any) {
      setCustomErron(error.response.data.message);
    } finally {
      setIsOtpResendLogin(false);
    }
  };
  return (
    <div className="flex py-2 box-border h-screen">
      <div className="left w-full md:w-1/2 h-full">
        {/* Left nav/logo */}
        <nav className="p-3 hidden md:block">
          <div className="flex gap-1 items-center">
            <img src="/hd.svg" alt="hd img" width={16} />
            <p className="font-bold text-base">HD</p>
          </div>
        </nav>

        <div className="form flex items-center flex-col justify-center h-full">
          {/* Mobile logo */}
          <div className="flex gap-1 items-center md:hidden">
            <img src="/hd.svg" alt="hd img" width={16} />
            <p className="font-bold text-base">HD</p>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-0 mb-5 justify-center items-center md:items-start md:justify-start">
            <h1 className="text-[32px] md:text-[40px] leading-11 font-bold">Sign in</h1>
            <p className="text-[#969696]">Please login to continue to your account.</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-2 w-[70%]" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth label="Email" error={!!errors.email} helperText={errors.email?.message} />}
            />

            {/* OTP Field (appears after clicking Get OTP) */}
            {otpVisible && (
              <>
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type={passwordVisible ? "text" : "password"}
                      fullWidth
                      label="OTP"
                      error={!!errors.otp}
                      helperText={errors.otp?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setPasswordVisible((prev) => !prev)} edge="end">
                              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {isOtpResendLogin ? (
                  <CircularProgress />
                ) : (
                  <button
                    disabled={sec < 120}
                    type="button"
                    onClick={resendOTP}
                    className="text-[#367AFF] cursor-pointer disabled:text-[#3679ffb4] disabled:cursor-not-allowed underline w-full text-left "
                  >
                    Resend OTP {formatedTime !== "02:00" && <span>in {formatedTime}</span>}
                  </button>
                )}
              </>
            )}

            {/* Get OTP button */}
            {!otpVisible && (
              <Button
                sx={{
                  backgroundColor: "#367AFF",
                  color: "white",
                  width: "100%",
                  textTransform: "none",
                }}
                onClick={handleGetOtp}
              >
                {isLoading ? <CircularProgress size="16px" sx={{ color: "white" }} /> : <span>Get OTP</span>}
              </Button>
            )}

            {/* Submit button */}
            {otpVisible && (
              <Button
                type="submit"
                sx={{
                  backgroundColor: "#367AFF",
                  color: "white",
                  width: "100%",
                  textTransform: "none",
                }}
              >
                {isLoading ? <CircularProgress size="16px" sx={{ color: "white" }} /> : <p>Sign In</p>}
              </Button>
            )}
          </form>
          {customError && <div className="text-red-500">{customError}</div>}

          {/* Footer */}
          <div className="mt-3 flex">
            <p className="text-[#969696]">Need an account?</p>
            <p>
              <Link href="/signup" className="text-[#367AFF] ml-2 underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden md:block right w-1/2 h-full mr-4">
        <img src="/right-column.png.jpg" alt="right-img" className="w-full h-[98%] rounded-2xl" />
      </div>
    </div>
  );
};

export default SignIn;
