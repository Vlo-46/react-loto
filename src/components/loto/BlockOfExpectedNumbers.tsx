import {Grid, Box, Typography, Paper} from '@mui/material'
import React from "react";

interface IBlockOfExpectedNumbersProps {
    expectedNumber: number
}

export default function BlockOfExpectedNumbers({expectedNumber}: IBlockOfExpectedNumbersProps) {
    return (
      <Box sx={{mb: 5}}>
          <Grid container item spacing={1} columns={3} direction="row"
                justifyContent="center">
              <Grid item>
                  <Paper style={{padding: 10, cursor: 'pointer'}} elevation={6}>
                      <Typography variant="h2"
                                  sx={{textAlign: 'center', fontWeight: 'bold'}}>{expectedNumber ? expectedNumber : '...'}</Typography>
                  </Paper>
              </Grid>
          </Grid>
      </Box>
    )
}