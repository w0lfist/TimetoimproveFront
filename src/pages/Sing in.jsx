import { useState} from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import RedirectionButton from "../components/redirection Button";
import Header from "../components/header";
import Footer from "../components/footer";
import "./styles/singin.css"

function SingIn() {
    const [name, setName] = useState("");
    const [last_name, setLastName] = useState("");
    const [user_name, setUserName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [training_level, setTrainingLevel] = useState("");
    const [disc_or_dise, setDiscOrDise] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);

    const sexOptions = ["Masculino", "Femenino"];
    const trainingLevelOptions = ["Principiante", "Intermedio", "Avanzado"];
    const discOrDiseOptions = [
        "Ninguna",
        "Enfermedad Cardiaca o Respiratoria",
        "Lesión leve en brazo/s",
        "Lesión leve en pierna/s"
    ];

    const navigate = useNavigate();

    const handlesubmint = async (e) => {
        e.preventDefault();

        if (!acceptTerms) {
            alert("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        try {
            const res = await axios.post("https://timetoimproveback.onrender.com/api/users", {
                name,
                last_name,
                user_name,
                age,
                sex,
                training_level,
                disc_or_dise,
                email,
                password 
            });

            console.log(res);
            e.target.reset();
            setAcceptTerms(false);
            navigate("/");
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Hubo un error en el registro. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="main-containers">
            <Header />
            <div className="info-containers">
                <form onSubmit={handlesubmint} className="form-container">
                    <h2>Registro</h2>
                    <div className="form-partone">
                        <div className="data-person">
                            <input 
                                type="text" 
                                placeholder="Nombre"
                                onChange={(e) => setName(e.target.value)}     
                                required
                            /><br/>
                            <input 
                                type="text" 
                                placeholder="Apellido" 
                                onChange={(e) => setLastName(e.target.value)}    
                                required
                            /><br/>
                            <input 
                                type="text" 
                                placeholder="Nombre de Usuario"
                                onChange={(e) => setUserName(e.target.value)}     
                                required
                            /><br/>
                        </div>
                        <div className="data-health">
                            <input 
                                type="number" 
                                placeholder="Edad"
                                onChange={(e) => setAge(e.target.value)}     
                                required
                                className="age"
                            /><br/>

                            <label className="title-label">Sexo</label><br/>
                            <ul className="options-list">
                                {sexOptions.map(option => (
                                    <li 
                                        key={option}
                                        className={sex === option ? 'selected' : ''}
                                        onClick={() => setSex(option)}
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>

                            <label className="title-label">Nivel de entrenamiento</label><br/>
                            <ul className="options-list">
                                {trainingLevelOptions.map(option => (
                                    <li 
                                        key={option}
                                        className={training_level === option ? 'selected' : ''}
                                        onClick={() => setTrainingLevel(option)}
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>

                            <label className="title-label">Discapacidad o enfermedad</label><br/>
                            <ul className="options-list">
                                {discOrDiseOptions.map(option => (
                                    <li 
                                        key={option}
                                        className={disc_or_dise === option ? 'selected' : ''}
                                        onClick={() => setDiscOrDise(option)}
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="data-contact">
                        <input 
                            type="email" 
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}     
                            required
                        /><br/>
                        <input 
                            type="password"  
                            placeholder="Contraseña"
                            onChange={(e) => setPassword(e.target.value)}     
                            required
                        /><br/>
                    </div>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={acceptTerms} 
                            onChange={(e) => setAcceptTerms(e.target.checked)} 
                            required 
                        />
                        Acepto los <a href="/terms-and-conditions" className="terms-link">términos y condiciones</a>
                    </label><br/>

                    <input type="submit" value="Registrar" className="submit-button"/>
                </form>
            </div>
            <Footer />
        </div>          
    );
}

export default SingIn;
