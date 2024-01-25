import {isAuth} from "../helpers/isAuth";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate()

    const isAuthenticated = isAuth()
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // axios.get(`${process.env.REACT_APP_SERVER_API_URI}/auth/me`)
    }, [])

    return (
      <>
          <h1>profile page user</h1>
      </>
    )
}