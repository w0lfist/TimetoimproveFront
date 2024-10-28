import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Importar axios
import Header from "../components/header";
import Footer from "../components/footer";
import beginnerImage from '../../public/multimedia/images/routines/beginner/beginner.jpg';
import intermediateImage from '../../public/multimedia/images/routines/intermediate/intermediate.jpg';
import advancedImage from '../../public/multimedia/images/routines/advance/advanced.jpg';
import "./styles/createtags.css"

function CreateTags() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedDay, setSelectedDay] = useState(''); // Día seleccionado
  const [routine, setRoutine] = useState(null); // Rutina seleccionada automáticamente
  const [error, setError] = useState(null); // Para manejar errores
  const [successMessage, setSuccessMessage] = useState(null); // Para manejar mensajes de éxito
  const navigate = useNavigate();
  const imageRoutineList = {
    "cuerpo completo principiante": beginnerImage,
    "cuerpo completo intermedio": intermediateImage,
    "cuerpo completo avanzado": advancedImage
  };

  // Comprobar el estado de autenticación y first_login al cargar el componente
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirige al login si no hay token
        return;
      }

      // Verifica el estado de first_login
      const response = await fetch(`${apiUrl}/check-user-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.first_login) {
          navigate('/dashboard'); // Redirige al dashboard si first_login es false
        }
      } else {
        setError("Error al verificar el estado del usuario.");
      }
    };

    checkUserStatus();
  }, [navigate]);

  const handleDaySelection = (day) => {
    setSelectedDay(day);  // Actualiza el día seleccionado
    setError(null); // Resetea el error al seleccionar un nuevo día
  };

  const handleRoutineSelection = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/assign-routine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.routine_name) {
        setRoutine({ name: data.routine_name });
        setError(null); // Restablecer el error si todo va bien
      } else {
        setError("Rutina no encontrada.");
      }
    } else {
      setError("Error al obtener la rutina automática.");
    }
  };

  // Función para obtener la imagen de la rutina
  const getRoutineImage = (routineName) => {
    if (!routineName) return null;

    const lowerCaseName = routineName.toLowerCase();

    if (lowerCaseName.includes("cuerpo completo") && lowerCaseName.includes("principiante")) {
      return imageRoutineList["cuerpo completo principiante"];
    } else if (lowerCaseName.includes("cuerpo completo") && lowerCaseName.includes("intermedio")) {
      return imageRoutineList["cuerpo completo intermedio"];
    } else if (lowerCaseName.includes("cuerpo completo") && lowerCaseName.includes("avanzado")) {
      return imageRoutineList["cuerpo completo avanzado"];
    }

    return null; // Retorna null si no hay coincidencias
  };

  // Manejar la creación de una tarjeta
  const handleCreateTag = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');  // Asegúrate de que el user_id esté almacenado

    if (!routine) {
      setError("Primero debes seleccionar una rutina.");
      return;
    }

    if (!selectedDay) {  // Cambiado de `selectedDay.length` a `!selectedDay`
      setError("Debes seleccionar un día para crear la tarjeta.");
      return;
    }

    try {
      // Enviar una solicitud para crear la tarjeta en el backend usando axios
      const response = await axios.post(
        `${apiUrl}/tag/create`, 
        {
          user_id: userId,
          day: selectedDay,  // Tomamos el día seleccionado
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
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || "Error al crear la tarjeta.");
      } else {
        setError("Error al crear la tarjeta.");
      }
    }
  };

  // Manejar el final del proceso y actualizar el estado de first_login
  const handleFinish = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
  
    // Primero, verificar si el usuario ha creado alguna tarjeta
    try {
      const tagsResponse = await axios.get(`${apiUrl}/api/tags/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Si se encuentran tarjetas, permitir que continúe el proceso
      if (tagsResponse.data && tagsResponse.data.length > 0) {
        const updateResponse = await fetch(`${apiUrl}/api/users/${userId}/first_login`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ first_login: false }),
        });
  
        if (updateResponse.ok) {
          navigate('/dashboard'); // Redirige al dashboard al finalizar
        } else {
          setError("Error al actualizar el estado de inicio.");
        }
      } 
    } catch (error) {
      setError("Antes de terminar deberas crear tus tarjetas");
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="info-containers">
        <div className="create-tags">
        <h1>!Empecemos¡</h1>
        <div className="introduction-tags">
          <h2>Creemos las tarjetas para organizar tus entrenamientos a lo largo de la semana</h2>
        </div>
        <div className="cratetags-form">
          <form>
            <div className="container-rutineassign">
              <p>Primero te asignaremos una rutina acorde a tu nivel.</p>
              <label> Pincha aqui:
                <button type="button" onClick={handleRoutineSelection} className="button-routine">
                  Seleccionar Rutina
                </button>
              </label>
              {routine && (
                <>
                  <p>esta sera tu rutina:</p>
                  <input type="text" value={routine.name} readOnly/>
                  <div className="routines-img"> 
                  <img 
                    src={getRoutineImage(routine.name)} 
                    alt={routine.name}  
                  />
                  </div>
                  
                </>
              )}
            </div>
            <div className="createtag-container">
              <p>Ahora las tarjetas. Crearemos una por una, asi que...</p>
              <label>
          ¿Qué día vas a entrenar?
        </label>
        <ul className="day-list">
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
            <div className="createtag-button">
              <p>Crea tu tarjeta y repite por cada dia que vayas a entrenar</p>
              <button type="button" onClick={handleCreateTag}>
                Crear Tarjeta
              </button>
              </div>
              <p>¿creaste tus tarjetas? !Entonces comencemos¡</p>
              <button type="button" onClick={handleFinish} className="button-finish">
                Terminar
              </button>
            </div>
            
          </form>
        </div>
      </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Mostrar mensaje de éxito */}
      <Footer />
    </div>
  );
}

export default CreateTags;
