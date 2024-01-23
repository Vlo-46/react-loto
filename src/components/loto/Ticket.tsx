import {Grid, Paper, Typography} from "@mui/material";
import React from "react";
import {ICub} from "../../helpers/loto";

interface ITicketProps {
    cell: ICub | undefined
    setSelected: (num: ICub | undefined) => (event: React.MouseEvent<HTMLElement>) => void
}

export default function Ticket({cell, setSelected}: ITicketProps) {
    return (
        <Grid item>
            <Paper style={{
                padding: 10,
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                backgroundColor: cell?.selected ? 'lightgray' : 'white',
            }}
                   elevation={4}
                   onClick={setSelected(cell)}
            >
                {cell ? (
                    <Typography variant="body1" sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: cell.selected ? 'green' : cell?.notMarked ? 'red' : 'black',
                        fontWeight: cell.notMarked || cell.selected ? 'bold' : ''
                    }}>{cell.selected ? 'X' : cell.num}</Typography>
                ) : (
                    <Typography variant="body1"></Typography>
                )}
            </Paper>
        </Grid>
    )
}