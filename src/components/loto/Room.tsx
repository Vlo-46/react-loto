import {Button, TableCell, TableRow} from "@mui/material";
import {IRoom} from "../../interfaces/global";

interface IRoomInterface {
    room: IRoom
    handleJoin: (roomId: string) => void
}

export default function Room({ room, handleJoin }: IRoomInterface) {
    return (
      <TableRow
        sx={{'&:last-child td, &:last-child th': {border: 0}}}
      >
          <TableCell component="th" scope="row">
              {room.roomName}
          </TableCell>
          <TableCell>{room.users?.length}</TableCell>
          <TableCell>
              <Button
                variant="outlined"
                color="primary"
                disabled={room.users?.length >= 5}
                onClick={() => handleJoin(room._id)}
              >
                  {room.users?.length >= 5 ? "Full" : "Join"}
              </Button>
          </TableCell>
      </TableRow>
    )
}