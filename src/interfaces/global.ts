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
    roomId: string
    users: number
}