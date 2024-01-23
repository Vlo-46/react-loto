import React, {MouseEvent, useEffect} from 'react'
import {Box, Grid} from '@mui/material'
import {createTickets, generateExpectedNumbers, ICub} from "../helpers/loto";
import {useState} from "react";
import Tickets from "../components/loto/Tickets";
import BlockOfExpectedNumbers from "../components/loto/BlockOfExpectedNumbers";

export default function Loto() {
    const result = createTickets()
    const [schema] = useState(result)
    const [clonedData, setClonedData] = useState(schema)

    const generatedNumbers = generateExpectedNumbers();
    const [expectedNumbers, setExpectedNumbers] = useState<number[]>(generatedNumbers);
    const [prevNumber, setPrevNumber] = useState<number | null>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setExpectedNumbers((prevNumbers) => {
                const newNumbers = [...prevNumbers];
                newNumbers.shift();
                setPrevNumber(prevNumbers[0]);
                return newNumbers;
            });
            checkNotMarkedItems();
            checkWinner()
        }, 4000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const setSelected = (cub: ICub | undefined) => (event: MouseEvent<HTMLElement>) => {
        if (!cub) return

        const foundCub = expectedNumbers.slice(0, 5).find((num: number) => num === (cub.num as number))
        if (!foundCub) return;

        const updatedData = clonedData.map((data: any) =>
          data.map((item: ICub[]) =>
            item.map((i: ICub) =>
              i && i.num === cub.num ? {...i, selected: true} : i
            )
          )
        );
        setClonedData(updatedData)
    }

    const renderTickets = (subGrid: []) => (
      <Grid container spacing={1} columns={9} sx={{mb: 5}}>
          {subGrid.map((row: [], rowIndex: number) => (
            <Tickets key={rowIndex} row={row} setSelected={setSelected}/>
          ))}
      </Grid>
    );

    const checkNotMarkedItems = (): void => {
        let updated = false;
        const updatedData = clonedData.map((data: any) =>
            data.map((item: ICub[]) =>
                item.map((i: ICub) =>
                    i && i.num === prevNumber && !i.selected ? {...i, notMarked: true} : i
                )
            )
        );
        if (updated) {
            setClonedData(updatedData)
        }
    };

    const checkWinner = () => {
        const isWinner = clonedData.flatMap(tickets => tickets.flat().map(item => item?.selected)).some(Boolean);
        if (isWinner) {
            alert('Game over. You won!')
        }
    };


    const renderSchema = (array: any) => (
      <Grid container spacing={2}>
          {array.map((subGrid: [], index: number) => (
            <Grid item key={index}>
                {renderTickets(subGrid)}
            </Grid>
          ))}
      </Grid>
    );

    return (
      <>
          <Box sx={{p: 5, mb: 5}}>
              <BlockOfExpectedNumbers expectedNumbers={expectedNumbers}/>
              {renderSchema(clonedData)}
          </Box>
      </>
    )
}