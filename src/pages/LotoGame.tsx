import React, {MouseEvent, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import io from 'socket.io-client';
import {Box, Grid, Alert, Button} from '@mui/material'
import Tickets from "../components/loto/Tickets";
import BlockOfExpectedNumbers from "../components/loto/BlockOfExpectedNumbers";
import {createTickets, generateExpectedNumbers, ICub} from "../helpers/loto";
import {isAuth} from "../helpers/isAuth";
import axios from "axios";
import {IAxiosConfig} from "../interfaces/global";
import {IUser} from "../interfaces/user";

interface IConnectedUser extends IUser {
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

    const {roomId} = useParams();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        setSocket(socket);

        if (socket) {
            axios.get(`${process.env.REACT_APP_SERVER_API_URI}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_JWT as string)}`
                }
            } as Partial<IAxiosConfig>)
              .then((response) => {
                  setCurrentUser(() => {
                      return response.data;
                  });

                  socket.emit('joinToRoom', {roomId, user: response.data})
              })
              .catch(e => console.log(e))
        }
        return () => {
            socket.emit('userDisconnect', currentUser)
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('updateUsers', (updatedUsers: IConnectedUser[]) => {
                console.log(updatedUsers)
                setConnectedUsers(updatedUsers)
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
        socket.emit('startGame', roomId)
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
                      key={user._id}>{user.name} {user.lastName}</h4>)
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
                                  onClick={handleStartGame}
                          >START</Button>
                      </Grid>
                      : <BlockOfExpectedNumbers expectedNumbers={expectedNumbers}/>
              }
              {renderSchema(clonedData)}
          </Box>
      </>
    )
}