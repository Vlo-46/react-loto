import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import LotoGame from "./pages/LotoGame";
import DrawerAppBar from "./layout/DrawerAppBar";
import Loto from "./pages/Loto";

function App() {
    return (
      <Router>
          <DrawerAppBar>
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/profile" element={<Profile/>}/>
                  <Route path="/loto" element={<Loto/>}/>
                  <Route path="/loto/:roomId" element={<LotoGame/>}/>
              </Routes>
          </DrawerAppBar>
      </Router>
    );
}

export default App;
