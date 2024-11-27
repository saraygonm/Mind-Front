import React, { useEffect } from 'react';

const ScoreBoard = ({ scores }) => {
    console.log('Scores:', scores); // Para depurar y ver qué datos se están pasando

    useEffect(() => {
        console.log("Scores: ", scores); // Mensaje para ver los puntajes en tiempo real
    }, [scores]);

    return (
        <div>
            <h3>Score Board</h3>
            <ul>
                {Object.entries(scores).length === 0 ? (
                    <li>No hay puntajes disponibles.</li>
                ) : (
                    Object.entries(scores).map(([player, score]) => (
                        <li key={player}>{player}: {score} puntos</li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ScoreBoard;
