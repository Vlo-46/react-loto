import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Loto from "./pages/Loto";
import DrawerAppBar from "./layout/DrawerAppBar";

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
                </Routes>
            </DrawerAppBar>
        </Router>
    );
}

export default App;
