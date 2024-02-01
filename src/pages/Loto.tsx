import {
    Grid,
    Typography,
    Box,
    LinearProgress
} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Rooms from "../components/loto/Rooms";
import {IAxiosConfig, IRoom} from "../interfaces/global";
import CreateRoom from "../components/loto/CreateRoom";
import io from "socket.io-client";
import axios from "axios";
import {IUser} from "../interfaces/user";
import {isAuth} from "../helpers/isAuth";

export default function Loto() {
    const navigate = useNavigate()

    const [socket, setSocket] = useState<any>(null);
    const [creatingRoom, setCreatingRoom] = useState<boolean>(false)
    const [rooms, setRooms] = useState<IRoom[]>([])
    const [user, setUser] = useState<IUser | null>(null)
    const [disableRoomCreation, setDisableRoomCreation] = useState<boolean>(false)

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

        const socket = io('http://localhost:5000');
        setSocket(socket);

        if (socket && user) {
            socket.emit('getRooms')
            socket.emit('canCreateRoom', user)
        }
        return () => {
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (socket) {
            socket.on('updateRooms', (rooms: any) => {
                setRooms(() => {
                    return rooms
                })
                setCreatingRoom(false)
            })
        }

        if (socket) {
            socket.on('canCreateRoom', (bool: boolean) => {
                setDisableRoomCreation(() => {
                    return bool
                })
            })
        }

        return () => {
            if (socket) {
                socket.off('updateRooms');
            }
        };
    }, [socket]);

    const handleJoin = (roomId: string) => {
        navigate(`/loto/${roomId}`)
    }

    const handleCreateRoom = (roomName: string) => {
        setCreatingRoom(true)
        socket.emit('createRoom', {roomName, user})
    }

    return (
      <>
          <Grid container>
              <Grid item xs={4}/>
              <Grid item xs={4}>
                  <Typography variant="h3">Rooms</Typography>
                  {
                      creatingRoom
                        ? <Box sx={{width: '100%', mb: 3, mt: 3}}>
                            <LinearProgress/>
                        </Box>
                        : null
                  }
                  <CreateRoom handleCreateRoom={handleCreateRoom} disableRoomCreation={disableRoomCreation}/>
                  {
                      rooms.length
                        ? <Rooms rooms={rooms} handleJoin={handleJoin}/>
                        : <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400}}>
                            <Typography variant="h5">No rooms yet</Typography>
                        </Box>
                  }
              </Grid>
              <Grid item xs={4}/>
          </Grid>
      </>
    )
}