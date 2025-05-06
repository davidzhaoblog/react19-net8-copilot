import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { RefreshRequest, TokenResponse } from '@/types/Authentication';
import { StorageKeys } from '@/types/StorageKeys';
import { Axios } from '@/shared/axiosApiClient/Axios';

export class AxiosApiBase extends Axios {
    // private token: string;

    /**
     * Creates an instance of api.
     * @param {import("axios").AxiosRequestConfig} conf
     */
    public constructor(conf: AxiosRequestConfig) {
        super(conf);

        // const cookies = new Cookies();
        // this.token = cookies.get(CookieKeys.Token);

        // this.getToken = this.getToken.bind(this);
        // this.setToken = this.setToken.bind(this);
        // this.getRefreshToken = this.getRefreshToken.bind(this);
        // this.setRefreshToken = this.setRefreshToken.bind(this);
        this.refresh = this.refresh.bind(this);
        this.getUri = this.getUri.bind(this);
        this.request = this.request.bind(this);
        this.get = this.get.bind(this);
        this.options = this.options.bind(this);
        this.delete = this.delete.bind(this);
        this.head = this.head.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.patch = this.patch.bind(this);
        this.success = this.success.bind(this);
        this.error = this.error.bind(this);

        this.interceptors?.request.use((param: AxiosRequestConfig) => {
            //console.log(param);
            const token = localStorage.getItem(StorageKeys.Token);
            if (token) {
                return {
                    ...param,

                    headers: {
                        ...param.headers,
                        "Authorization": `Bearer ${token}`
                    },
                }
            }
            return {
                ...param,
                headers: {
                    ...param.headers,
                }
            }

        }, (error: any) => {
            // handling error
            // console.log(error);
            throw error;
        });

        let isRefreshing = false;
        // this middleware is been called right before the response is get it by the method that triggers the request
        // the original code was commented out below.
        // fixes from https://github.com/axios/axios/issues/1510.
        this.interceptors?.response.use((param) => ({
            ...param
        }), async (error: { config: any; response: { status: number; }; }) => {
            // Something went wrong, figure out how to handle it here or in a `.catch` somewhere down the pipe
            // TODO: refresh token when expire every N minutes:
            // https://stackoverflow.com/questions/35900230/axios-interceptors-and-asynchronous-login
            //console.log(error);
            const originalRequest = error.config;

            // https://blog.theashishmaurya.me/handling-jwt-access-and-refresh-token-using-axios-in-react-app
            // If the error status is 401 and there is no originalRequest._retry flag,
            // it means the token has expired and we need to refresh it
            // also: 
            // https://medium.com/@sina.alizadeh120/repeating-failed-requests-after-token-refresh-in-axios-interceptors-for-react-js-apps-50feb54ddcbc
            if (error.response.status === 401 && !isRefreshing) {
                isRefreshing = true;

                try {
                    const refreshToken = localStorage.getItem(StorageKeys.RefreshToken);
                    // console.log("interceptors", refreshToken);
                    if(refreshToken != null)
                    {
                        const refreshResponse = await this.refresh({ refreshToken });
                        
                        // Retry the original request with the new token
                        originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
                        return axios(originalRequest);
                    }
                } catch (error) {
                    // Handle refresh token error or redirect to login
                    window.location.pathname = "/autoLogout";
                }
            }

            return Promise.reject(error);
        });
    }
    // /**
    //  * Gets Token.
    //  *
    //  * @returns {string} token.
    //  * @memberof Api
    //  */
    // public getToken = () => {
    //     // const cookies = new Cookies();
    //     // const token = cookies.get(CookieKeys.Token, { doNotParse: true });
    //     const token = localStorage.getItem(CookieKeys.Token);

    //     // console.log("getToken: ", token);
    //     if (token) {
    //         return `Bearer ${token}`;
    //     }
    //     return null;
    // }
    // /**
    //  * Sets Token.
    //  *
    //  * @param {string} token - token.
    //  * @memberof Api
    //  */
    // public setToken = (token: string) => {
    //     // const cookies = new Cookies();
    //     // cookies.remove(CookieKeys.Token, { path: '/' })
    //     localStorage.setItem(CookieKeys.Token, token);
    //     // console.log("setToken: ", token);
    //     // this.token = token;
    // }
    // /**
    //      * Gets RefreshToken.
    //      *
    //      * @returns {string} RefreshToken.
    //      * @memberof Api
    //      */
    // public getRefreshToken = () => {
    //     // const cookies = new Cookies();
    //     const refreshToken = localStorage.getItem(CookieKeys.RefreshToken);
        
    //     console.log("getRefreshToken: ", refreshToken);
    //     return refreshToken;
    // }
    // /**
    //  * Sets RefreshToken.
    //  *
    //  * @param {string} refreshToken - RefreshToken.
    //  * @memberof Api
    //  */
    // public setRefreshToken = (refreshToken: string) => {
    //     // const cookies = new Cookies();
    //     // cookies.remove(CookieKeys.RefreshToken, { path: '/' })
    //     localStorage.setItem(CookieKeys.RefreshToken, refreshToken);
        
    //     console.log("setRefreshToken: ", refreshToken);
    //     // this.token = token;
    // }

    // 3. Refresh Request and Response
    public refresh = (params: RefreshRequest): Promise<TokenResponse> => {
        const url = "/refresh";
        // console.log('AxiosApiBase RefreshToken params', params);
        return this.post<TokenResponse, RefreshRequest, AxiosResponse<TokenResponse>>(url, params)
            .then(res => {
                // console.log('AxiosApiBase RefreshToken', res);
                const { accessToken, refreshToken } = res.data;
                localStorage.setItem(StorageKeys.Token, accessToken);
                localStorage.setItem(StorageKeys.RefreshToken, refreshToken);
                return this.success(res);
            });
    }

    /**
     * Get Uri
     *
     * @param {import("axios").AxiosRequestConfig} [config]
     * @returns {string}
     * @memberof Api
     */
    public getUri = (config?: AxiosRequestConfig): string => {
        return this.getUri(config);
    }
    /**
     * Generic request.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP axios response payload.
     * @memberof Api
     *
     * @example
     * api.request({
     *   method: "GET|POST|DELETE|PUT|PATCH"
     *   baseUrl: "http://www.domain.com",
     *   url: "/api/v1/users",
     *   headers: {
     *     "Content-Type": "application/json"
     *  }
     * }).then((response: AxiosResponse<User>) => response.data)
     *
     */
    public request<T, R = AxiosResponse<T>>(
        config: AxiosRequestConfig
    ): Promise<R> {
        return this.request(config);
    }
    /**
     * HTTP GET method, used to fetch data `statusCode`: 200.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} HTTP `axios` response payload.
     * @memberof Api
     */
    public get<T, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.get(url, config);
    }
    /**
     * HTTP OPTIONS method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} HTTP `axios` response payload.
     * @memberof Api
     */
    public options<T, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.options(url, config);
    }
    /**
     * HTTP DELETE method, `statusCode`: 204 No Content.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public delete<T, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.delete(url, config);
    }
    /**
     * HTTP HEAD method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public head<T, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.head(url, config);
    }
    /**
     * HTTP POST method `statusCode`: 201 Created.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public post<T, B, R = AxiosResponse<T>>(
        url: string,
        data?: B,
        config?: AxiosRequestConfig
    ): Promise<R> {
        
        return this.post(url, data, config);
    }
    /**
     * HTTP PUT method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public put<T, B, R = AxiosResponse<T>>(
        url: string,
        data?: B,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.put(url, data, config);
    }
    /**
     * HTTP PATCH method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public patch<T, B, R = AxiosResponse<T>>(
        url: string,
        data?: B,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.patch(url, data, config);
    }
    /**
     *
     * @template T - type.
     * @param {import("axios").AxiosResponse<T>} response - axios response.
     * @returns {T} - expected object.
     * @memberof Api
     */
    public success = <T>(response: AxiosResponse<T>): T => {
        //console.log(response);
        return response.data;
    }
    /**
     *
     *
     * @template T type.
     * @param {AxiosError<T>} error
     * @memberof Api
     */
    public error = <T>(error: AxiosError<T>): void => {
        throw error;
    }

    protected buildFullUrl = (url: string, routeParams: any, queryStringParams_NonArray: any, queryStringParams_Array?: {key: string, values: any[]}[]) => {
        let fullUrl = this.buildFullUrlWebApiRouteOnly(url, routeParams);
        let queryStrings = "";
        if (!!queryStringParams_NonArray) {
            queryStrings = this.convertParametersToQueryString_NonArray(queryStringParams_NonArray);
        }
        if (!!queryStringParams_Array) {
            const queryStrings_Array = queryStringParams_Array.map(item => this.convertParametersToQueryString_Array(item.key, item.values)).join('&');
            if(!!queryStrings_Array) {
                queryStrings = !!queryStrings && !!queryStrings_Array
                    ? queryStrings + "&" + queryStrings_Array
                    : queryStrings + queryStrings_Array;
            }
        }
        fullUrl = !!queryStrings ? fullUrl + '?' + queryStrings : fullUrl;
        return fullUrl;
    }

    protected buildFullUrlWebApiRouteOnly = (url: string, routeParams: any) => {
        let fullUrl = url;
        if (!!routeParams) {
            const relativeRoute = this.convertParametersToWebApiRoute(routeParams);
            if (!!relativeRoute) {
                fullUrl += '/' + relativeRoute;
            }
        }
        return fullUrl;
    }

    protected convertParametersToWebApiRoute = (params: any): string => {
        // https://morioh.com/p/480aef8e92cd
        // Exclude empty or null or undefined properties or fields.
        // ES 6
        if (!!!params)
            return "";
        return Object.keys(params).filter(key => params[key]).map(key => '' + params[key]).join('/');

        // // ES 5
        // return Object.keys(params).filter(function(key){ return params[key]; }).map(function(key) {
        //   return key + '=' + params[key]
        // }).join('&');
    }

    protected convertParametersToQueryString_NonArray = (params: any): string => {
        // https://morioh.com/p/480aef8e92cd
        // Exclude empty or null or undefined properties or fields.
        // ES 6
        if (!!!params)
            return '';
        return Object.keys(params).filter(key => params[key]).map(key => key + '=' + encodeURIComponent(params[key])).join('&');

        // // ES 5
        // return Object.keys(params).filter(function(key){ return params[key]; }).map(function(key) {
        //   return key + '=' + params[key]
        // }).join('&');
    }
    
    protected convertParametersToQueryString_Array = (key: string, values: any[]): string => {
        // https://morioh.com/p/480aef8e92cd
        // Exclude empty or null or undefined properties or fields.
        // ES 6
        if (!!!values)
            return '';
        return values.map(item => key + '=' + item).join('&');
    }
}
