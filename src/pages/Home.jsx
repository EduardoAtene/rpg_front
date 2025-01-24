import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            <h1 className="mb-4 text-center">RPG Sistema</h1>
            <div className="d-flex gap-3">
                <Link to="/players" className="btn btn-primary btn-lg">
                    Jogadores
                </Link>
                <Link to="/sessions" className="btn btn-secondary btn-lg">
                    Sessões
                </Link>
            </div>
        </div>
    );
};

export default Home;
