import {Button, TableCell, TableRow} from "@mui/material";
import {IRoom} from "../../interfaces/global";

interface IRoomInterface {
    room: IRoom
    handleJoin: (roomId: string) => void
}

export default function Room({ room, handleJoin }: IRoomInterface) {
    return (
      <TableRow
        key={room.roomId}
        sx={{'&:last-child td, &:last-child th': {border: 0}}}
      >
          <TableCell component="th" scope="row">
              {room.roomId}
          </TableCell>
          <TableCell>{room.users}</TableCell>
          <TableCell>
              <Button
                variant="outlined"
                color="primary"
                disabled={room.users >= 5}
                onClick={() => handleJoin(room.roomId)}
              >
                  {room.users >= 5 ? "Full" : "Join"}
              </Button>
          </TableCell>
      </TableRow>
    )
}