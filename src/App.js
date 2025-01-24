import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Players from "./pages/Players";
import CreatePlayer from "./pages/CreatePlayer";
import Sessions from "./pages/Sessions";
import CreateSession from "./pages/CreateSession";
import StartSession from "./pages/StartSession";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                
                <Route path="/players" element={<Players />} />
                <Route path="/players/create" element={<CreatePlayer />} />
                <Route path="/players/edit/:id" element={<CreatePlayer />} />
                
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/sessions/create" element={<CreateSession />} />
                <Route path="/sessions/edit/:id" element={<CreateSession />} />

                <Route path="/sessions/start/:id" element={<StartSession />} />
            </Routes>
        </Router>
    );
};

export default App;
