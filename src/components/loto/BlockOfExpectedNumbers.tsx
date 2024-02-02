import {Grid, Box, Typography, Paper} from '@mui/material'
import React from "react";

interface IBlockOfExpectedNumbersProps {
    currentNumber: number
}

export default function BlockOfExpectedNumbers({currentNumber}: IBlockOfExpectedNumbersProps) {
    return (
      <Box sx={{mb: 5}}>
          <Grid container item spacing={1} columns={3} direction="row"
                justifyContent="center">
              <Grid item>
                  <Paper style={{padding: 10, cursor: 'pointer'}} elevation={6}>
                      <Typography variant="h2"
                                  sx={{
                                      textAlign: 'center',
                                      fontWeight: 'bold'
                                  }}>{currentNumber ? currentNumber : 'Starting...'}</Typography>
                  </Paper>
              </Grid>
          </Grid>
      </Box>
    )
}