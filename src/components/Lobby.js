import React, { useEffect, useState } from 'react';
import { connect, subscribeToTopic, sendMessage } from '../services/WebSocketService';
import Wheel from './Wheel';
import ScoreBoard from './ScoreBoard'; // Asegúrate de importar el componente ScoreBoard
import './Lobby.css';

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
        <div className="main-container">
            <div className={`lobby-container ${isGameStarted ? 'lobby-started game-started lobbycontainer tablaLobby' : ''}`}>
                {/* Este div solo contiene los elementos del lobby */}
                <div className="contlobby">
                    <div className="lobby-content">
                        <h2 className="lobby-title">Lobby para {gameName}</h2>
                        <p className="lobby-subtitle">Usuarios en el lobby:</p>
                        <ul className="user-list">
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <li key={index} className="user-item">{user}</li>
                                ))
                            ) : (
                                <p className="no-users">No hay usuarios aún :(</p>
                            )}
                        </ul>

                        {/* Solo se muestra el botón de iniciar el juego si el juego no ha comenzado y hay al menos dos usuarios */}
                        {!isGameStarted && users.length >= 2 && (
                            <button className="start-game-button" onClick={handleStartGame}>Comenzar Juego</button>
                        )}
                    </div>
                </div>

                {/* Solo mostrar la parte del juego cuando haya comenzado */}
                {isGameStarted && (
                    <div className="game-info">
                        {/* Mostrar el puntaje actual en el contenedor con la clase 'scoreboard-container' */}
                        <div className="scoreboard-container">
                            <ScoreBoard scores={scores} />
                        </div>

                        <div className="game-container">
                            <h3 className="current-player">Jugador Actual: {currentPlayer}</h3>

                            {currentPlayer === userName ? (
                                <Wheel onSpinComplete={(topic) => {
                                    setSelectedTopic(topic);
                                    sendMessage('/app/topicSelected', JSON.stringify({ gameName, topic }));
                                }} />
                            ) : (
                                <p className="waiting-text">Esperando a que {currentPlayer} gire la ruleta...</p>
                            )}

                            {showTopicSelected && <p className="topic-selected">Tema seleccionado: {selectedTopic}</p>}

                            {showQuestion && currentQuestion && (
                                <div className="question-container">
                                    <h4 className="category-title">Categoría: {currentQuestion.category}</h4>
                                    <p className="question-text">{currentQuestion.questionText}</p>

                                    <div className="option-buttons-container">
                                        {/* Los botones se organizarán automáticamente en 4 columnas */}
                                        {currentQuestion.options.map((option, idx) => (
                                            <button key={idx} className="option-button" onClick={() => handleAnswerSubmit(option)}>
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>



    );

};
export default Lobby;

