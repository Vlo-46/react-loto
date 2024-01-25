import {isAuth} from "../helpers/isAuth";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IUser} from "../interfaces/user";
import axios from "axios";
import {IRequestConfig} from "../interfaces/global";

export default function Profile() {
    const navigate = useNavigate()

    const isAuthenticated = isAuth()
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate]);

    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_API_URI}/auth/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_JWT as string)}`
            }
        } as IRequestConfig)
            .then(res => {
                setUser(res.data)
            })
            .catch(e => console.log(e))
    }, []);

    return (
      <>
          <h1>profile page</h1>
      </>
    )
}