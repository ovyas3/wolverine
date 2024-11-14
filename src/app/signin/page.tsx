"use client";

import React from "react";
import "./page.css";
import Image from "next/image";
// import Logo from "../../assets/logo.svg";
import { useState } from "react";
import { httpsPost } from "@/utils/Communication";
import { useRouter } from "next/navigation";
import { handleAuthentication } from "@/services/Authenticator/Auth";
import showPassword from "@/assets/show_password.svg";
import hidePassword from "@/assets/hide_password.svg";
// import { useSnackbar } from "@/hooks/snackBar";
import bgBottomLeft from '@/assets/bg.png'

const Signin = () => {
  // const { showMessage } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [hidePasswordFlag, setHidePasswordFlag] = useState(true);

  const handleLogin = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.length || !password.length) {
      // showMessage("Please fill all the fields.", "error");
      return;
    } else if (!emailPattern.test(email)) {
      // showMessage("Please enter a valid Email.", "error");
      return;
    }
    httpsPost("saas_user/signin", { email_id: email, password, from: "web" },router, false, 'captain')
      .then(async (response: any) => {
        if (response.statusCode === 200) {
          const signedIn = await handleAuthentication(
            response.data
          );
          if (signedIn) {
            router.push("/dashboard");
          }
        } else {
          // showMessage(response.message, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <div className="signin">
      <Image src={bgBottomLeft} alt="" className="absolute top-0 right-0"/>
      <Image src={bgBottomLeft} alt="" className="absolute bottom-0 left-0 rotate-180"/>
      <div className="content">
        {/* <Image alt="" src={Logo}></Image> */}
        <div className="header">
          <div className="heading">Sign in</div>
          {/* <div className="new-user">
            New user?
            <span style={{ color: "#3351FF", cursor: "pointer" }}>
              &nbsp;Create an account
            </span>
          </div> */}
        </div>
        <div className="main-content">
          <div className="input-content">
            <span className="input-header">Email Address</span>
            <input
              className="input-box"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-content">
            <span className="input-header">Password</span>
            <input
              className="input-box password"
              type={hidePasswordFlag ? "password" : "text"}
              onChange={(e) => {
                const updatedPassword = e.target.value.replace(/•/g, "-");
                setPassword(updatedPassword);
              }}
            />
            {!hidePasswordFlag && (
              <Image
                alt=""
                src={showPassword}
                className="icon"
                onClick={() => setHidePasswordFlag(true)}
              />
            )}
            {hidePasswordFlag && (
              <Image
                alt=""
                src={hidePassword}
                className="icon"
                onClick={() => setHidePasswordFlag(false)}
              />
            )}
          </div>
        </div>
        {/* <div className="forgot-password">Forgot Password?</div> */}

        <div className="footer">
          <div>
            <button className="login-btn" onClick={handleLogin}>
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
