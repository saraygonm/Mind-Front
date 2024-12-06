import React, { useEffect } from 'react';

const ScoreBoard = ({ scores }) => {
    console.log('Scores:', scores); // Para depurar y ver qué datos se están pasando

    useEffect(() => {
        console.log("Scores: ", scores); // Mensaje para ver los puntajes en tiempo real
    }, [scores]);

    return (
        <div>
            <h3>Tabla de Puntajes</h3>
            <ul>
                {Object.entries(scores).length === 0 ? (
                    <li className="no-scores">No hay puntajes disponibles</li>
                ) : (
                    Object.entries(scores).map(([player, score]) => (
                        <li key={player}>{player} className="score-item": {score} puntos</li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ScoreBoard;
