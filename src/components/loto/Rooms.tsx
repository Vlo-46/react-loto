import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {IRoom} from "../../interfaces/global";
import Room from "./Room";

interface IRoomsInterface {
    rooms: IRoom[]
    handleJoin: (roomId: string) => void
}

export default function Rooms({ rooms, handleJoin }: IRoomsInterface) {
    return (
      <>
          <TableContainer component={Paper} sx={{mt: 5}}>
              <Table size="small" aria-label="a dense table">
                  <TableHead>
                      <TableRow>
                          <TableCell>Room</TableCell>
                          <TableCell>Users</TableCell>
                          <TableCell/>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {rooms.map((room) => (
                        <Room room={room} handleJoin={handleJoin} key={room._id}/>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </>
    )
}