import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Importar axios

function CreateTag({ fetchTasks }) {
  const [selectedDay, setSelectedDay] = useState(''); // Día seleccionado
  const [routine, setRoutine] = useState(null); // Rutina seleccionada automáticamente
  const [error, setError] = useState(null); // Para manejar errores
  const [successMessage, setSuccessMessage] = useState(null); // Para manejar mensajes de éxito
  const navigate = useNavigate();

  const handleDaySelection = (day) => {
    setSelectedDay(day);  // Actualiza el día seleccionado
    setError(null); // Resetea el error al seleccionar un nuevo día
  };

  const handleSearchRoutine = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id'); // Asegurarse de obtener el userId aquí

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/routines/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.routine_name) {
        setRoutine({ name: response.data.routine_name });
      } else {
        setError("Rutina no encontrada.");
      }
    } catch (error) {
      setError("Error al obtener la rutina.");
    }
  };

  const handleCreateTag = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');  // Asegúrate de que el user_id esté almacenado

    if (!routine) {
      setError("Primero debes buscar tu rutina.");
      return;
    }

    if (!selectedDay) {  // Cambiado de `selectedDay.length` a `!selectedDay`
      setError("Debes seleccionar un día para crear la tarjeta.");
      return;
    }

    try {
      // Enviar una solicitud para crear la tarjeta en el backend usando axios
      const response = await axios.post(
        'http://127.0.0.1:8000/tag/create', 
        {
          user_id: userId,
          day: selectedDay,
          routine: routine.name,  // Asegúrate de que routine.name sea una cadena
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Si la tarjeta se crea correctamente, resetear el día actual
      setSelectedDay('');  // Cambiado de `setSelectedDays([]);` a `setSelectedDay('');`
      setError(null);
      setSuccessMessage(response.data.message); // Guardar el mensaje de éxito

      // Actualizar la lista de tarjetas
      fetchTasks();
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta:", error.response.data);
        setError(error.response.data.detail || "Error al crear la tarjeta.");
      } else {
        setError("Error al crear la tarjeta.");
      }
    }
  };

  return (
    <div className="create-tag">
      <div className="introduction-tag">
        <h2>Crea tu tarjeta</h2>
      </div>
      <div className="createtag-form">
        <form>
          <div className="container-routinesearch">
            <button type="button" onClick={handleSearchRoutine} className="button-routine">
              Buscar rutina
            </button>
            {routine && (
              <>
                <p>Esta es tu rutina:</p>
                <textarea
                  value={typeof routine === 'string' ? routine : routine.name || "Rutina no disponible"}
                  readOnly
                  className="box-routine-name"
                />
              </>
            )}
          </div>
          <div className="createtag-container">
            <label>
              ¿Qué día vas a entrenar?
            </label>
            <ul className="day-list-createtag">
              {["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(day => (
                <li 
                  key={day} 
                  onClick={() => handleDaySelection(day)} 
                  className={selectedDay === day ? 'selected' : ''}
                >
                  {day}
                </li>
              ))}
            </ul>
          </div> 
        </form>
        <div className="createone-tagbutton">
          <button type="button" onClick={handleCreateTag}>
            Crear Tarjeta
          </button>
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Mostrar mensaje de éxito */}
    </div>    
  );
}

export default CreateTag;
