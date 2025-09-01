"use client";

import React, { useState } from "react";
import { Button, TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { LocalizationProvider, DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { SignUpschema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof SignUpschema>;

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [otpVisible, setOtpVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>("");
  const router = useRouter();

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(SignUpschema),
    defaultValues: {
      name: "",
      dob: undefined,
      email: "",
      otp: "",
    },
    mode: "onChange",
  });

  const name = watch("name");
  const email = watch("email");
  const dob = watch("dob");

  // handle form submit
  const onSubmit = async (data: FormValues) => {
    const { email, otp } = data;
    try {
      setIsLoading(true);
      await axios.post("/api/verifyotp", {
        email,
        otp,
      });
      router.replace("/signin");
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // handle OTP button click
  const handleGetOtp = async () => {
    // validate first three fields
    const isValid = await trigger(["name", "dob", "email"]);
    if (isValid) {
      const formattedDob = dob ? format(dob, "yyyy-MM-dd") : null;
      try {
        setIsLoading(true);
        await axios.post("/api/signup", {
          name,
          email,
          dob: formattedDob,
        });
        setOtpVisible(true);
      } catch (error: any) {
        setCustomError(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex py-2 box-border h-screen">
      <div className="left w-full md:w-1/2 h-full">
        <nav className="p-3 none md:block">
          <div className="flex gap-1 items-center">
            <img src="/hd.svg" alt="hd img" width={16} />
            <p className="font-bold text-base">HD</p>
          </div>
        </nav>

        <div className="form flex items-center flex-col justify-center h-full">
          <div className="flex gap-1 items-center md:hidden">
            <img src="/hd.svg" alt="hd img" width={16} />
            <p className="font-bold text-base">HD</p>
          </div>
          <div className="flex flex-col gap-0 mb-5 justify-center items-center md:items-start md:justify-start">
            <h1 className="text-[32px] md:text-[40px] leading-11 font-bold">Sign up</h1>
            <p className="text-[#969696]">Sign up to enjoy the feature of HD</p>
          </div>

          <form className="flex flex-col gap-2 w-[70%]" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => <TextField {...field} label="Your Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />}
            />

            {/* DOB */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of Birth"
                    disableFuture
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    open={calendarOpen}
                    onOpen={() => setCalendarOpen(true)}
                    onClose={() => setCalendarOpen(false)}
                    timezone="system"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dob,
                        helperText: errors.dob?.message,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton onClick={(e) => setCalendarOpen(true)}>
                                <img src="/calendar.svg" alt="calendar" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      },
                      openPickerButton: { sx: { display: "none" } },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message} />}
            />

            {/* OTP (shown only after Get OTP is clicked) */}
            {otpVisible && (
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="OTP"
                    type={passwordVisible ? "text" : "password"}
                    fullWidth
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
                    slotProps={{
                      input: {
                        inputProps: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 4,
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setPasswordVisible((prev) => !prev)} edge="end">
                              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            )}

            {/* Get OTP button (always visible) */}
            {!otpVisible && (
              <Button
                onClick={handleGetOtp}
                sx={{
                  backgroundColor: "#367AFF",
                  color: "white",
                  textAlign: "center",
                  width: "100%",
                  height: "40px",
                  textTransform: "none",
                  ":hover": { backgroundColor: "#265fd6" },
                }}
              >
                {isLoading ? <CircularProgress size="16px" sx={{ color: "white" }} /> : <p>Get OTP</p>}
              </Button>
            )}

            {/* Submit button (only after OTP is visible) */}
            {otpVisible && (
              <Button
                type="submit"
                sx={{
                  backgroundColor: "#367AFF",
                  color: "white",
                  textAlign: "center",
                  width: "100%",
                  textTransform: "none",
                  height: "40px",
                  ":hover": { backgroundColor: "#265fd6" },
                }}
              >
                {isLoading ? <CircularProgress size="16px" sx={{ color: "white" }} /> : <p>Submit</p>}
              </Button>
            )}
          </form>

          {errors?.root && <div className="text-red-500 font-bold">{errors?.root?.message}</div>}
          {customError && <div className="text-red-500 font-bold">{customError}</div>}
          <div className="mt-3 flex">
            <p className="text-[#969696]">Already have an account??</p>
            <p>
              <Link href="/signin" className="text-[#367AFF] ml-2 underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block right w-1/2 h-full mr-4">
        <img src="/right-column.png.jpg" alt="right-img" className="w-full h-[98%] rounded-2xl" />
      </div>
    </div>
  );
};

export default SignUp;
