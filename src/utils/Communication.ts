"use client";
import axios from "axios";
import { environment } from "@/environments/env.api";
import { getAuth } from "@/services/Authenticator/Auth";
import { deleteAllCache } from '@/utils/storageService';

const devFunction = (service: any) => environment.DEV_API_URL(service);
const prodFunction = (service: any) => environment.PROD_API_URL(service);

const prefix: any = {
  development: devFunction,
  dev: devFunction,
  production: prodFunction,
  prod: prodFunction,
};

const env = process.env.NODE_ENV



let redirectInProgress = false;

const httpsGet = async (path: string,router: any = null,service: string = 'himalayas') => {
  const authorization = {
    Authorization: getAuth(),
  };

  console.log(env)
  const url = prefix[env](service) + path;
  const config = {
    method: "GET",
    url,
    headers: authorization,
  };
  const response = await axios(config)
    .then((res) => res)
    .catch((err) => {
      if (axios.isAxiosError(err) && err.response?.status === 401 && !redirectInProgress) {
        redirectInProgress = true
         router.push('/signin')
        deleteAllCache()
      } else {
        redirectInProgress = false
      }
    });
    return response?.data;
};

const httpsPost = async (path: string, data: any, router: any = null,isFile = false, service: string = 'himalayas') => {
  const auth = getAuth();
  const authorization = {
    Authorization: auth,
  };
  const headers = {
    Authorization: auth,
    'Content-Type': 'multipart/form-data'
  };
  const url = prefix[env](service) + path;
  let config;
  if (isFile) {
    config = {
      method: "POST",
      url,
      headers: headers,
      data,
    };
  } else {
    config = {
      method: "POST",
      url,
      headers: authorization,
      data,
    };
  }
  // try {
    const response = await axios(config)
      .then((res) => res)
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401 && !redirectInProgress) {
          redirectInProgress = true
          if(url.includes('shipper_user/signin')) {
            return err.response.data 
          }
          router.push('/signin')
          deleteAllCache();
        } else {
          redirectInProgress = false
        }
        return err.response.data 
      });
    return response?.data || response;
};

const apiCall = async (config: any) => {
  const finalConf = {
    ...config,
  };
  if (finalConf.headers) {
    finalConf.headers = {
      ...finalConf.headers,
      Authorization: getAuth(),
    };
  } else {
    finalConf.headers = {
      Authorization: getAuth(),
    };
  }
  await axios(finalConf);
};

export { httpsGet, httpsPost, apiCall };
