import {ChangeEvent, useState} from "react";
import {Button, Modal, Box, TextField} from '@mui/material'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: "5px",
    p: 4,
};

interface ICreateRoomInterface {
    handleCreateRoom: (roomName: string) => void
}

export default function CreateRoom({handleCreateRoom}: ICreateRoomInterface) {
    const [open, setOpen] = useState(false);
    const [roomName, setRoomName] = useState<string>('')
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRoomName(event.target.value)
    }

    const handleNewRoom = () => {
        if (!roomName) return
        handleCreateRoom(roomName)
        setOpen(false)
    }

    return (
      <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleOpen}>Create Room</Button>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
              <Box sx={style}>
                  <TextField
                    label="Room Name"
                    name="name"
                    fullWidth
                    onChange={handleOnChange}
                  />
                  <Button variant="contained"  sx={{ mt: 3 }} onClick={handleNewRoom}>Create</Button>
              </Box>
          </Modal>
      </div>
    )
}