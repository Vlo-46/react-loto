import {Grid} from "@mui/material";
import React from "react";
import Ticket from "./Ticket";
import {ICub} from "../../helpers/loto";

interface ITicketsProps {
    row: []
    setSelected: (num: ICub | undefined) => (event: React.MouseEvent<HTMLElement>) => void
}

export default function Tickets({row, setSelected}: ITicketsProps) {
    return (
      <Grid container item spacing={1} sx={{mb: 1}}>
          {row.map((cell, cellIndex: number) => (
            <Ticket cell={cell} key={cellIndex} setSelected={setSelected}/>
          ))}
      </Grid>
    )
}