import {AxiosRequestConfig} from "axios";

export interface IFormField {
    id: string
    name: string
    label: string
    type: string
}

export interface IRequestConfig extends AxiosRequestConfig {
    headers?: {
        Authorization: string
    }
}