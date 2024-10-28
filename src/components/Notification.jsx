import React, { useEffect } from 'react';
import './styles/Notification.css'; // Asegúrate de crear el archivo CSS correspondiente

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // El mensaje se cierra automáticamente después de 4 segundos

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <p>{message}</p>
        </div>
    );
};

export default Notification;
