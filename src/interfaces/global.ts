import {IUser} from "./user";

export interface IFormField {
    id: string
    name: string
    label: string
    type: string
}

export interface IAxiosConfig {
    headers: {
        Authorization: string
    }
}

export interface IRoom {
    _id: string
    users: IUser[]
    roomName: string
    createdAt?: string
    updatedAt?: string
}