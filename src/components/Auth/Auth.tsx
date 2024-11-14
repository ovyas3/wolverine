"use client";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import "./Auth.css";
import Loader from "../Loading/WithBackDrop";
import { getCookie } from "cookies-next";

const AuthController = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("access_token");
    if (token) {
      router.push("/dashboard");
    } else { 
      router.push("/signin");
    }
  }, []);

  return (
    <Box sx={{ display: "flex" }} className="auth">
      <h1>Authenticating</h1>
      <CircularProgress className="progressBar" color="secondary" />
    </Box>
  );
};

const Auth = () => {
  return (
    <Suspense fallback={<Loader />}>
      <AuthController />
    </Suspense>
  );
};
export default Auth;
