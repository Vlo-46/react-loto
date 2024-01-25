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

    return (
      <>
          <h1>profile page user</h1>
      </>
    )
}