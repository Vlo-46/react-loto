import {
    Grid,
    Typography,
    Box,
    LinearProgress
} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Rooms from "../components/loto/Rooms";
import {IRoom} from "../interfaces/global";
import CreateRoom from "../components/loto/CreateRoom";
import io from "socket.io-client";

export default function Loto() {
    const navigate = useNavigate()

    const [socket, setSocket] = useState<any>(null);
    const [creatingRoom, setCreatingRoom] = useState<boolean>(false)
    const [rooms, setRooms] = useState<IRoom[]>([])

    useEffect(() => {
        const socket = io('http://localhost:5000');
        setSocket(socket);

        if (socket) {
            socket.emit('getRooms')
        }
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('rooms', (rooms: any) => {
                setRooms(() => {
                    return rooms
                })
            })
        }

        if (socket) {
            socket.on('createdRoom', (room: IRoom) => {
                setRooms((prevState) => {
                    const rooms = [...prevState]
                    rooms.push(room)
                    return rooms
                })
                setCreatingRoom(false)
            })
        }

        return () => {
            if (socket) {
                socket.off('rooms');
                socket.off('createdRoom');
            }
        };
    }, [socket]);

    const handleJoin = (roomId: string) => {
        navigate(`/loto/${roomId}`)
    }

    const handleCreateRoom = (roomName: string) => {
        setCreatingRoom(true)
        socket.emit('createRoom', roomName)
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
                  <CreateRoom handleCreateRoom={handleCreateRoom}/>
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