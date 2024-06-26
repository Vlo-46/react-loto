import React, {MouseEvent, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import io from 'socket.io-client';
import {Box, Grid, Alert, Button} from '@mui/material'
import Tickets from "../components/loto/Tickets";
import BlockOfExpectedNumbers from "../components/loto/BlockOfExpectedNumbers";
import {ICub} from "../helpers/loto";
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

    const {roomId} = useParams();

    const [socket, setSocket] = useState<any>(null);

    const [currentUser, setCurrentUser] = useState<IConnectedUser | null>(null)
    const [clonedData, setClonedData] = useState<any>([])
    const [connectedUsers, setConnectedUsers] = useState<IConnectedUser[]>([])
    const [isRoomAuthor, setIsRoomAuthor] = useState(false)


    const [startGame, setStartGame] = useState<boolean>(false)
    const [intervalId, setIntervalId] = useState<any>(null);
    const [expectedNumbers, setExpectedNumbers] = useState<number[]>([])
    const [prevNumber, setPrevNumber] = useState<number>(0)
    const [currentNumber, setCurrentNumber] = useState<number>(0)
    const [endGame, setEndgame] = useState<null | string>(null)


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
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('userExist', () => {
                navigate('/loto')
            })
        }

        if (socket && currentUser) {
            socket.on('roomData', (data: any) => {
                if (data) {
                    setConnectedUsers(() => {
                        return data.users
                    })

                    const userData = data.users.find((item: any) => item._id === currentUser?._id)

                    setClonedData(() => {
                        return userData.tickets?.data
                    })
                    setStartGame(() => {
                        return data.gameIsStarted
                    })
                    setIsRoomAuthor(() => {
                        return data.author._id === currentUser._id
                    })

                    if (!!expectedNumbers && !expectedNumbers.length && !currentNumber && !prevNumber) {
                        setExpectedNumbers(() => {
                            return data.expectedNumbers?.numbers
                        })

                        setCurrentNumber(() => {
                            return expectedNumbers[0]
                        })
                    }
                }
            })
        }

        if (socket) {
            socket.on('gameIsStarted', (bool: boolean) => {
                setStartGame(() => bool)
            })
        }

        if (socket) {
            socket.on('leavingTheRoom', () => {
                navigate('/loto')
            })
        }

        if (socket) {
            socket.on('finishGame', (data: any) => {
                clearInterval(intervalId);
                setIntervalId(null);
                setExpectedNumbers([])
                setStartGame(false)
                if (!data.winners) {
                    setEndgame('You lose!!!')
                } else {
                    setEndgame(`${data.winner} is winner`)
                }

                setTimeout(() => {
                    navigate('/loto')
                }, 3000)
            })
        }

        return () => {
            if (socket) {
                socket.off('userExist');
                socket.off('roomData');
                socket.off('gameIsStarted');
                socket.off('leavingTheRoom');
                socket.off('finishGame');
            }
        };
    }, [socket, currentUser, startGame]);

    useEffect(() => {
        if (startGame && !endGame) {
            const interval = setInterval(() => {
                const currentNumberIdx = expectedNumbers.indexOf(currentNumber)
                setCurrentNumber((prevState) => {
                    setPrevNumber(prevState)
                    return expectedNumbers[currentNumberIdx + 1]
                })
            }, 4000);

            setIntervalId(interval);

            return () => {
                clearInterval(interval);
            };
        }
    }, [startGame, endGame, expectedNumbers, currentNumber]);

    useEffect(() => {
        setTimeout(() => checkNotMarkedItems(), 4000)
    }, [prevNumber]);

    const handleStartGame = () => {
        socket.emit('startGame', roomId)
    }

    const setSelected = (cub: ICub | undefined) => (event: MouseEvent<HTMLElement>) => {
        if (!startGame || endGame || !cub || currentNumber !== cub.num) {
            return
        }

        socket.emit('checkSelected', {user: currentUser, roomId, num: cub.num})
    }

    const checkNotMarkedItems = (): void => {

        if (socket) {
            if (expectedNumbers.length) {
                const currentNumberIdx = expectedNumbers.indexOf(currentNumber)

                if (currentNumberIdx + 1 === expectedNumbers.length) {
                    socket.emit('gameIsFinished', {users: connectedUsers, roomId})
                } else {
                    socket.emit('checkNotMarkedItems', {user: currentUser, roomId, num: prevNumber})
                }
            }
        }
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
                                  disabled={!isRoomAuthor}
                          >START</Button>
                      </Grid>
                      : <BlockOfExpectedNumbers currentNumber={currentNumber}/>
              }
              {
                  clonedData?.length
                    ? renderSchema(clonedData)
                    : null
              }
          </Box>
      </>
    )
}