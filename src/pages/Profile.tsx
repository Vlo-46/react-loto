import {ChangeEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios'
import {Container, Typography, Grid, TextField, Button, Alert} from '@mui/material'
import ProfileSkeleton from "../components/skeleton/ProfileSkeleton";
import {isAuth} from "../helpers/isAuth";
import {IUser} from "../interfaces/user";
import {IAxiosConfig} from "../interfaces/global";

export default function Profile() {
    const [user, setUser] = useState<Partial<IUser> | null>(null)
    const navigate = useNavigate()

    const isAuthenticated = isAuth()
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_API_URI}/auth/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_JWT as string)}`
            }
        } as Partial<IAxiosConfig>)
          .then((response) => {
              setUser(response.data)
          })
          .catch(e => console.log(e))
    }, [])

    const [userData, setUserData] = useState<Partial<IUser>>({})
    const [updatedSuccessfully, setUpdatedSuccessfully] = useState<boolean | {
        err?: boolean,
        success?: boolean
    }>()

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        // userData[event.target.name as keyof IUser] = event.target.value;
        // setUserData(userData)
    }

    const errorHandler = (data: {
        err?: boolean,
        success?: boolean
    }) => {
        setUpdatedSuccessfully(data)
        setTimeout(() => {
            setUpdatedSuccessfully(false)
        }, 3000)
    }

    const handleSaveChanges = () => {
        axios.put(`${process.env.REACT_APP_SERVER_API_URI}/users`, {data: {...userData, _id: user?._id}}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_JWT as string)}`
            }
        } as IAxiosConfig)
          .then((response) => {
              errorHandler({
                  err: !response.data.updated
              })
              setUser(response.data)
          })
          .catch((error) => {
              errorHandler({
                  err: true
              })
          })
    };

    return (
      <>
          <Container>
              <Typography variant="h4" gutterBottom>
                  Profile Page
              </Typography>
              {
                  !user
                    ? <ProfileSkeleton/>
                    : <Grid container spacing={2} sx={{mt: 5}}>
                        <Grid container spacing={8}>
                            <Grid item xs={7}>
                                <Grid container>
                                    {
                                        updatedSuccessfully
                                          ? typeof updatedSuccessfully !== "boolean" && updatedSuccessfully?.err
                                            ? <Alert severity="error" sx={{width: '100%', mb: 3}}>
                                                Something went wrong
                                            </Alert>
                                            : <Alert severity="success" sx={{width: '100%', mb: 3}}>
                                                Updated Successfully
                                            </Alert>
                                          : null
                                    }

                                    <Grid item sx={{mb: 2}} xs={12}>
                                        <TextField
                                          label="Name"
                                          variant="outlined"
                                          fullWidth
                                          defaultValue={user.name}
                                          name="name"
                                          onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item sx={{mb: 2}} xs={12}>
                                        <TextField
                                          label="Last Name"
                                          name="lastName"
                                          variant="outlined"
                                          fullWidth
                                          defaultValue={user.lastName}
                                          onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item sx={{mb: 2}} xs={12}>
                                        <TextField
                                          label="Email"
                                          variant="outlined"
                                          fullWidth
                                          defaultValue={user.email}
                                          name="email"
                                          onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item sx={{mb: 2}} xs={12}>
                                        <TextField
                                          label="Password"
                                          type="password"
                                          variant="outlined"
                                          fullWidth
                                          name="password"
                                          onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item sx={{mb: 2}} xs={12}>
                                        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                                            Save Changes
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Statistics of {user.name} {user.lastName}
                                    </Typography>
                                    <Typography variant="body1">
                                        Wins: {user.wins}
                                    </Typography>
                                    <Typography variant="body1">
                                        Losses: {user.losses}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
              }
          </Container>
      </>
    )
}