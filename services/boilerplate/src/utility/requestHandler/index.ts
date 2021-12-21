import axios from 'axios';

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK'

export interface RequestConfig {
    url?: string;
    method?: Method;
    headers?: any;
    params?: any;
    data?: any;
}

export const requestHandler = async function (options: RequestConfig) {

    const axiosRes = await axios(options);

    return axiosRes?.data;
}