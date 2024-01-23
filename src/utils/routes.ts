import {IRoutes} from "../interfaces/routes";

export const routes: IRoutes[] = [
    {
        id: "home-page",
        href: "/",
        name: "Home",
        isActive: true,
    },
    {
        id: "login-page",
        href: "/login",
        name: "Login",
        isActive: false,
        hideAfterLogin: true
    },
    {
        id: "register-page",
        href: "/register",
        name: "Register",
        isActive: false,
        hideAfterLogin: true
    },
    {
        id: "profile-page",
        href: "/profile",
        name: "Profile",
        isActive: false,
        needToLogin: true
    },
    {
        id: "loto",
        href: '/loto',
        name: "Loto",
        isActive: false,
        needToLogin: false
    }
]