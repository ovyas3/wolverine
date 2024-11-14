"use client";
import { setCookies, getCookie } from "@/utils/storageService";

const authenticate = async (data: any) => {
  const {
    accessToken,
    name,
    roles
  } = data;
  if(accessToken) {
  localStorage.setItem("user_name", name);
  localStorage.setItem("roles", JSON.stringify(roles));
  setCookies("access_token", accessToken);
  return true
  } else {
    return false
  }
};

export const handleAuthentication = async (
  data: any
) => {
  if (data) {
      const cookiesSet = authenticate(data)
      return cookiesSet;
  }
  return false;
};


export const getAuth = () => {
  const token = getCookie("access_token");
  return `bearer ${token}`;
};

