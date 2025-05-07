// the following code from:
// https://medium.com/@enetoOlveda/how-to-use-axios-typescript-like-a-pro-7c882f71e34a

import { AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASEURL;

export const apiConfig: AxiosRequestConfig = {
    // TODO: Investigation "withCredentials: false" was working with WebApi Core 3.1, but not working with .Net 6.
    withCredentials: false,
    timeout: 30000,
    baseURL: baseURL,
    headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "Content-Type": "application/json",
        Accept: "application/json",
        'Access-Control-Allow-Origin': '*'
    },
}
