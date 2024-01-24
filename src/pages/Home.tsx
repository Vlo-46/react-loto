import React from 'react';
import {Box, Button, Typography} from '@mui/material'
import {Link} from "react-router-dom";

export default function Home() {
    return (
      <Box sx={{p: 5, m: 5}}>
          <Box sx={{mb: 3}}>
              <Typography variant="h3" sx={{mb: 2}}>
                  Welcome to LotoMania: Your Gateway to Excitement and Fortune!
              </Typography>
              <Typography variant="body1">
                  Are you ready to embark on a thrilling journey where luck meets opportunity? Look no further than
                  LotoMania, your premier destination for an exhilarating lottery experience. We bring you a world of
                  excitement, anticipation, and the chance to turn your dreams into reality with our enticing range of
                  lottery games.
              </Typography>
          </Box>
          <Box sx={{mb: 3}}>
              <Typography variant="h3" sx={{mb: 2}}>
                  Why Choose LotoMania?
              </Typography>
              <Typography variant="body1">
                  Diverse Games: Explore a variety of engaging lottery games, each with its unique charm and winning
                  potential. From classic number draws to innovative instant-win games, we offer something for every
                  type of player.
              </Typography>
              <Typography variant="body1">Transparency: At LotoMania, we prioritize transparency and fairness. Our draw
                  processes are rigorously monitored to ensure that every player has an equal chance of hitting the
                  jackpot. Trust is the foundation of our platform.</Typography>
              <Typography variant="body1">
                  Jackpots Galore: Dream big, because at LotoMania, our jackpots are as colossal as your aspirations.
                  Imagine what you could achieve with a life-changing sum – it all starts with the click of a button.
              </Typography>
              <Typography variant="body1">
                  User-Friendly Platform: Our user-friendly interface ensures a seamless gaming experience for both
                  newcomers and seasoned players. Easily navigate through our website, purchase tickets, and track your
                  winnings with just a few clicks.
              </Typography>
              <Typography variant="body1">
                  Secure Transactions: Your security is our priority. Rest assured that every transaction is encrypted
                  and protected, guaranteeing a safe environment for you to enjoy the thrill of the game.
              </Typography>
          </Box>
          <Box sx={{mb: 3}}>
              <Typography variant="h3" sx={{mb: 2}}>Get Started Today!</Typography>
              <Typography variant="body1">Join the LotoMania community and take the first step towards a world of
                  excitement and limitless possibilities. Register now to explore our games, claim exclusive bonuses,
                  and immerse yourself in the electrifying world of lottery gaming.</Typography>
              <Typography variant="body1">Don’t miss out on the chance to be our next big winner. Your fortune awaits at
                  LotoMania – where dreams come true, one ticket at a time.</Typography>
              <Typography variant="body1">Ready to play? Click <Link to={'/register'}>Register</Link> now and let the adventure begin!</Typography>
          </Box>
      </Box>
    )
}