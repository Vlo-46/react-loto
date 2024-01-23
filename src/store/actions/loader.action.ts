import { HIDE_LOADER, SHOW_LOADER } from "../types";

export function showLoader() {
    return (dispatch: (arg0: { type: string; }) => any) => dispatch({ type: SHOW_LOADER })
}

export function hideLoader() {
    return (dispatch: (arg0: { type: string; }) => any) => dispatch({ type: HIDE_LOADER })
}