import {
    Grid,
    Typography,
    Box,
    LinearProgress
} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Rooms from "../components/loto/rooms";
import {IRoom} from "../interfaces/global";
import CreateRoom from "../components/loto/CreateRoom";

function createData(
  roomId: string,
  users: number
): IRoom {
    return {roomId, users};
}

export default function Loto() {
    const navigate = useNavigate()
    const [creatingRoom, setCreatingRoom] = useState<boolean>(false)

    const [rooms, setRooms] = useState<IRoom[]>([
        createData('Room 1', 1),
        createData('Room 2', 5),
        createData('Room 3', 4),
        createData('Room 4', 2),
        createData('Room 5', 1),
    ])

    const handleJoin = (roomId: string) => {
        navigate(`/loto/${roomId}`)
    }

    const handleCreateRoom = (roomName: string) => {
        setCreatingRoom(true)
        setRooms((prevState) => {
            const prevRooms = [...prevState]
            prevRooms.push(createData(roomName, 1))
            return prevRooms
        })
        setTimeout(() => {
            handleJoin(roomName)
        }, 3000)
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
                        : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                            <Typography variant="h5">No rooms yet</Typography>
                        </Box>
                  }
              </Grid>
              <Grid item xs={4}/>
          </Grid>
      </>
    )
}