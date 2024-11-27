import React, { useState } from 'react';
import './Wheel.css';

const Wheel = ({ onSpinComplete }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const topics = ['Ciencia', 'Geografía', 'Cultura', 'Historia'];
    const [selectedTopic, setSelectedTopic] = useState('');
    const [rotation, setRotation] = useState(0); // Estado para almacenar la rotación actual

    const spinWheel = () => {
        if (!isSpinning) {
            setIsSpinning(true);
            const selectedTopicIndex = Math.floor(Math.random() * topics.length);
            const selected = topics[selectedTopicIndex];
            setSelectedTopic(selected);

            const extraRotation = 720;
            const finalRotation = 360 + (selectedTopicIndex * 90) + extraRotation;

            // Establecer la rotación y usar un timeout para terminar el giro
            setRotation(finalRotation);

            setTimeout(() => {
                setIsSpinning(false);
                onSpinComplete(selected); // Esto se llama al final del giro
            }, 3000); // Duración del giro
        }
    };

    return (
        <div className="wheel-container">
            <div
                className={`wheel ${isSpinning ? 'spinning' : ''}`}
                style={{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? 'transform 3s ease' : 'none' }}
            >
                <div className="arrow">➤</div>
                {topics.map((topic, index) => (
                    <div key={index} className={`segment segment-${index}`}>
                        <span>{topic}</span>
                   </div>
                ))}
            </div>
            <button onClick={spinWheel} disabled={isSpinning}>
                {isSpinning ? 'Girando...' : 'Girar Ruleta'}
            </button>
            {!isSpinning && selectedTopic && <h3>Tema seleccionado: {selectedTopic}</h3>}
        </div>
    );
};

export default Wheel;
