export function isAuth() {
    const token = localStorage.getItem(process.env.REACT_APP_AUTH_JWT as string);
    return !!token;
}