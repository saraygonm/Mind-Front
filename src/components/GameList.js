import React, { useEffect, useState } from 'react';
import { connect, subscribeToTopic, sendMessage } from '../services/WebSocketService';
import './GameList.css';

const GameList = ({ userName, onSelectGame }) => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        connect(() => {
            sendMessage('/app/get', '');
            subscribeToTopic('/topic/games', (message) => {
                const receivedGames = JSON.parse(message.body);
                setGames(receivedGames);
            });
        });
    }, []);

    return (
        <div className="container">
            <h2 className="title">Available Games</h2>
            <ul className="list">
                {games.length > 0 ? (
                    games.map((game, index) => (
                        <li key={index} className="list-item">
                            <div className="game-info">
                                <strong className="game-name">{game.name}</strong>
                                <span className="creator">Created by {game.createdBy}</span>
                            </div>
                            <button className="join-button" onClick={() => onSelectGame(game.name)}>
                                Join
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="no-games">No games available.</p>
                )}
            </ul>
        </div>
    );
};

export default GameList;
