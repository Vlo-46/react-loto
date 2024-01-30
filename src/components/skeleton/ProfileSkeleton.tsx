import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function ProfileSkeleton() {
    return (
      <Box sx={{width: '100%', height: 1000}}>
          <Skeleton/>
          {
              Array.from(Array(10).keys()).map(item => (
                <Skeleton animation="wave" key={item} sx={{mb: 1}}/>
              ))
          }
      </Box>
    );
}