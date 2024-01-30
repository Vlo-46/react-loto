import React, {MouseEvent, useEffect, useState} from 'react'
import {Box, Grid, Alert, Button} from '@mui/material'
import io from 'socket.io-client';
import {createTickets, generateExpectedNumbers, ICub} from "../helpers/loto";
import Tickets from "../components/loto/Tickets";
import BlockOfExpectedNumbers from "../components/loto/BlockOfExpectedNumbers";
import {useNavigate} from "react-router-dom";
import {isAuth} from "../helpers/isAuth";

interface IConnectedUser {
    name: string
    isReady: boolean
}

export default function LotoGame() {
    const navigate = useNavigate()
    const isAuthenticated = isAuth()

    const result = createTickets()
    const generatedNumbers = generateExpectedNumbers();

    const [socket, setSocket] = useState<any>(null);
    const [schema] = useState(result)
    const [clonedData, setClonedData] = useState(schema)
    const [prevNumber, setPrevNumber] = useState<number | null>(null)
    const [intervalId, setIntervalId] = useState<any>(null);
    const [expectedNumbers, setExpectedNumbers] = useState<number[]>(generatedNumbers);
    const [startGame, setStartGame] = useState<boolean>(false)
    const [endGame, setEndgame] = useState<null | string>(null)
    const [connectedUsers, setConnectedUsers] = useState<IConnectedUser[]>([])
    const [currentUser, setCurrentUser] = useState<IConnectedUser | null>(null)


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        setSocket(socket);

        if (socket) {
            const connectedUser = {
                name: `John ${generatedNumbers[0]}`,
                isReady: false
            };

            setCurrentUser((prevUser) => {
                return connectedUser;
            });
            socket.emit('join', connectedUser)
        }
        return () => {
            socket.emit('userDisconnect', currentUser)
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('updateUsers', (updatedUsers: IConnectedUser[]) => {
                setConnectedUsers(updatedUsers)
            });
        }

        if (socket) {
            socket.on('usersReady', (usersReady: boolean) => {
                if (usersReady) {
                    handleStartGame()
                }
            });
        }

        if (socket) {
            socket.on('gameOver', (winner: string) => {
                clearInterval(intervalId);
                setIntervalId(null);
                setEndgame(`Game over. ${winner} won!`)
            });
        }

        if (socket) {
            socket.on('startGame', (bool: boolean) => {
                setStartGame(() => bool)
            })
        }

        return () => {
            if (socket) {
                socket.off('updateUsers');
                socket.off('userReady');
                socket.off('gameOver');
            }
        };
    }, [socket]);

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
        socket.emit('startGame', true)
    }

    const handleReady = () => {
        if (connectedUsers.length <= 1) return

        if (currentUser) {
            const newUser = {...currentUser, isReady: !currentUser.isReady}
            setCurrentUser(newUser)
            socket.emit('ready', newUser.isReady)
        }
    }

    const setSelected = (cub: ICub | undefined) => (event: MouseEvent<HTMLElement>) => {
        if (!startGame || endGame || !cub) return;

        const foundCub = expectedNumbers.slice(0, 1).find((num: number) => num === (cub.num as number))
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

            if (socket) {
                socket.emit('winner', currentUser?.name);
            }
        }
    };

    const renderTickets = (subGrid: []) => (
      <Grid container spacing={1} columns={9} sx={{mb: 5}}>
          {subGrid.map((row: [], rowIndex: number) => (
            <Tickets key={rowIndex} row={row} setSelected={setSelected}/>
          ))}
      </Grid>
    );

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
                  !!connectedUsers
                    ? connectedUsers.map((user: IConnectedUser) => <h4
                      key={user.name}>{user.name} is {user.isReady ? 'Ready' : 'Not ready'}</h4>)
                    : null
              }
              {
                  endGame
                    ? <Alert variant="filled" severity="info" sx={{mb: 5}}>
                        {endGame}
                    </Alert>
                    : !startGame
                      ? <Grid container item spacing={1} columns={3} direction="row"
                              justifyContent="center" sx={{mb: 2}}>
                          <Button variant="outlined"
                                  size="small"
                                  disabled={connectedUsers.length <= 1}
                                  onClick={handleReady}>{currentUser?.isReady ? 'not ready' : 'ready'}</Button>
                      </Grid>
                      : <BlockOfExpectedNumbers expectedNumbers={expectedNumbers}/>
              }
              {renderSchema(clonedData)}
          </Box>
      </>
    )
}