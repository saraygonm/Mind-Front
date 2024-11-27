import React, { useEffect, useState } from 'react';
import { connect, subscribeToTopic, sendMessage } from '../services/WebSocketService';
import Wheel from './Wheel';
import ScoreBoard from './ScoreBoard'; // Asegúrate de importar el componente ScoreBoard

const Lobby = ({ gameName, userName }) => {
    const [users, setUsers] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [scores, setScores] = useState({}); // Inicializa scores como un objeto vacío
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [showTopicSelected, setShowTopicSelected] = useState(false);

    useEffect(() => {
        // Conectar solo si aún no estamos conectados
        const connectWebSocket = () => {
            connect(() => {
                console.log(`Connected to lobby for game: ${gameName}`);
                sendMessage('/app/join', JSON.stringify({ gameName, userName }));
    
                subscribeToTopic(`/topic/lobby/${gameName}`, (message) => {
                    const receivedUsers = JSON.parse(message.body);
                    setUsers(receivedUsers);
                });
    
                subscribeToTopic(`/topic/gameStart/${gameName}`, (message) => {
                    setIsGameStarted(true);
                    console.log('Game started!');
                });
    
                subscribeToTopic(`/topic/turn/${gameName}`, (message) => {
                    const player = message.body;
                    setCurrentPlayer(player);
                    console.log(`${player} is spinning the wheel`);
                    if (player !== userName) {
                        alert(`${player} está girando la ruleta.`);
                    }
                });
    
                subscribeToTopic(`/topic/topicSelected/${gameName}`, (message) => {
                    const topic = message.body;
                    setSelectedTopic(topic);
                    alert(`Tema seleccionado: ${topic}`);
                    setShowTopicSelected(true);
                });
    
                subscribeToTopic(`/topic/question/${gameName}`, (message) => {
                    const question = JSON.parse(message.body);
                    setCurrentQuestion(question);
                    setShowQuestion(true);
                    setShowTopicSelected(false);
                });
    
                subscribeToTopic(`/topic/scores/${gameName}`, (message) => {
                    const updatedScores = JSON.parse(message.body);
                    setScores(updatedScores); // Esto actualizará el estado de scores y forzará un re-render
                });                
    
                subscribeToTopic(`/topic/pointWinner/${gameName}`, (message) => {
                    const winnerMessage = message.body;
                    alert(winnerMessage); // Esto debería mostrar quién ganó el punto
                });                
    
                subscribeToTopic(`/topic/winner/${gameName}`, (message) => {
                    const winner = message.body;
                    alert(`¡El juego ha terminado! El ganador es ${winner}`);
                    setIsGameStarted(false);
                });
            });
        };
    
        connectWebSocket(); // Llama a la función para conectar al WebSocket
    
        // Limpieza para evitar conexiones duplicadas al salir del componente
        return () => {
            // Aquí puedes agregar la lógica para desconectar WebSocket si es necesario
        };
    }, [gameName, userName]); // Dependencias del useEffect
    

    const handleStartGame = () => {
        sendMessage('/app/startGame', gameName);
    };

    /*const handleSpinWheel = () => {
        if (userName === currentPlayer) {
            setShowQuestion(false); // Asegúrate de que sea false antes de girar
            sendMessage('/app/spinWheel', gameName);
        } else {
            alert(`Esperando a que ${currentPlayer} gire la ruleta.`);
        }
    };*/

    const handleAnswerSubmit = (answer) => {
        if (showQuestion) {
            console.log(`Enviando respuesta: ${answer} para el jugador: ${userName}`); // Mensaje de depuración
            sendMessage('/app/submitAnswer', JSON.stringify({
                gameName,
                userName,
                answer // Aquí se envía la opción seleccionada (A, B, C, o D)
            }));
        }
    };
    
    

    return (
        <div>
            <h2>Lobby for {gameName}</h2>
            <p>Users in the lobby:</p>
            <ul>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))
                ) : (
                    <p>No users in the lobby yet.</p>
                )}
            </ul>

            {!isGameStarted && users.length >= 2 && (
                <button onClick={handleStartGame}>Comenzar Juego</button>
            )}

            {isGameStarted && (
                <div>
                    <h3>Current Player: {currentPlayer}</h3>
                    
                    {currentPlayer === userName ? (
                        <Wheel onSpinComplete={(topic) => {
                            setSelectedTopic(topic);
                            sendMessage('/app/topicSelected', JSON.stringify({ gameName, topic }));
                        }} />
                    ) : (
                        <p>Esperando a que {currentPlayer} gire la ruleta...</p>
                    )}

                    {showTopicSelected && <p>Tema seleccionado: {selectedTopic}</p>} 

                    {showQuestion && currentQuestion && (
                        <div>
                            <h4>Categoría: {currentQuestion.category}</h4>
                            <p>{currentQuestion.questionText}</p> {/* Mostrar la pregunta */}
                            {currentQuestion.options.map((option, idx) => (
                                <button key={idx} onClick={() => handleAnswerSubmit(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <ScoreBoard scores={scores} /> {/* Mostrar la puntuación actualizada aquí */}
        
        </div>
    );
};

export default Lobby;
