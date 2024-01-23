import {Grid, Box, Typography, Paper} from '@mui/material'
import React from "react";

interface IBlockOfExpectedNumbersProps {
    expectedNumbers: number[]
}

export default function BlockOfExpectedNumbers({expectedNumbers}: IBlockOfExpectedNumbersProps) {
    return (
        <Box sx={{mb: 5}}>
            <Grid container item spacing={1} columns={3} direction="row"
                  justifyContent="center">
                {expectedNumbers?.slice(0, 1).map((num: number) => (
                    <Grid item key={num}>
                        <Paper style={{padding: 10, cursor: 'pointer'}} elevation={6}>
                            <Typography variant="h2"
                                        sx={{textAlign: 'center', fontWeight: 'bold'}}>{num}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}