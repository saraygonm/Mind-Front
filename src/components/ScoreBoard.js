import React, { useEffect } from 'react';

const ScoreBoard = ({ scores }) => {
    useEffect(() => {
        console.log("Scores: ", scores); // Mensaje para depuración en tiempo real
    }, [scores]);

    return (
        <div className="scoreboard">
            <h3 className="scoreboard-title">Tabla de Puntajes</h3>
            <ul className="score-list">
                {Object.keys(scores).length === 0 ? (
                    <li className="no-scores">No hay puntajes disponibles</li>
                ) : (
                    Object.entries(scores).map(([player, score]) => (
                        <li key={player} className="score-item">
                            {player}: {score} puntos
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ScoreBoard;
