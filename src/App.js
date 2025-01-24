import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Players from "./pages/Players";
import CreatePlayer from "./pages/CreatePlayer";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/players" element={<Players />} />
                <Route path="/players/create" element={<CreatePlayer />} />
                <Route path="/players/edit/:id" element={<CreatePlayer />} />
            </Routes>
        </Router>
    );
};

export default App;
