import {HIDE_LOADER, SHOW_LOADER} from "../types";

const initialState: { loaded: boolean } = {
    loaded: false
}

export const loaderReducer = (state = initialState, action: ILoaderAction) => {
    switch (action.type) {
        case SHOW_LOADER:
            return {...state, loaded: false}
        case HIDE_LOADER:
            return {...state, loaded: true}
        default:
            return state
    }
}

export interface ILoaderAction {
    type: string
    loading: boolean
}