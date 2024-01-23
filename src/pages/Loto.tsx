import React, {MouseEvent, useEffect} from 'react'
import {Box, Grid, Alert, Button} from '@mui/material'
import {createTickets, generateExpectedNumbers, ICub} from "../helpers/loto";
import {useState} from "react";
import Tickets from "../components/loto/Tickets";
import BlockOfExpectedNumbers from "../components/loto/BlockOfExpectedNumbers";

export default function Loto() {
    const result = createTickets()
    const generatedNumbers = generateExpectedNumbers();

    const [schema] = useState(result)
    const [clonedData, setClonedData] = useState(schema)
    const [prevNumber, setPrevNumber] = useState<number | null>(null)
    const [intervalId, setIntervalId] = useState<any>(null);
    const [expectedNumbers, setExpectedNumbers] = useState<number[]>(generatedNumbers);
    const [startGame, setStartGame] = useState<boolean>(false)
    const [endGame, setEndgame] = useState<null | string>(null)

    useEffect(() => {
        if (startGame && !endGame) {
            const interval = setInterval(() => {
                setExpectedNumbers((prevNumbers) => {
                    const newNumbers = [...prevNumbers];
                    const shiftedNumber = newNumbers.shift();

                    setPrevNumber(shiftedNumber as number);
                    return newNumbers;
                });
            }, 4000);

            setIntervalId(interval);

            return () => {
                clearInterval(interval);
            };
        }
    }, [startGame]);

    useEffect(() => {
        checkNotMarkedItems();
    }, [prevNumber]);

    const handleStartGame = () => {
        setStartGame(true)
    }

    const setSelected = (cub: ICub | undefined) => (event: MouseEvent<HTMLElement>) => {
        if (!startGame || endGame || !cub) return;

        const foundCub = expectedNumbers.slice(0,1).find((num: number) => num === (cub.num as number))
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
        if (!expectedNumbers.length) {
            setEndgame('Game over. You lose!')
        }

        const updatedData = clonedData.map((data: any) => {
            checkWinner(data)
            return data.map((item: ICub[]) =>
                item.map((i: ICub) =>
                    i && i.num === prevNumber && !i.selected ? {...i, notMarked: true} : i
                )
            )
        });
        setClonedData(updatedData)
    };

    const checkWinner = (data: any) => {
        const ticket = data.flatMap((tickets: any) => tickets).filter((item: ICub) => item);
        const isAllItemsSelected = ticket.every((item: ICub) => item && item.selected);

        if (isAllItemsSelected) {
            clearInterval(intervalId);
            setIntervalId(null);
            setEndgame('Game over. You won!')
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
                {
                    endGame
                        ? <Alert variant="filled" severity="info" sx={{mb: 5}}>
                            {endGame}
                        </Alert>
                        : null
                }
                {
                    !startGame
                        ? <Grid container item spacing={1} columns={3} direction="row"
                                justifyContent="center" sx={{mb: 2}}>
                            <Button variant="outlined" size="small" onClick={handleStartGame}>START</Button>
                        </Grid>
                        : <BlockOfExpectedNumbers expectedNumbers={expectedNumbers}/>
                }
                {renderSchema(clonedData)}
            </Box>
        </>
    )
}