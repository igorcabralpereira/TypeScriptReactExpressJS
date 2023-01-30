import React, { useContext, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as C from '../../App.styles';
import { AuthContext } from "../../contexts/Auth/AuthContext";


export const LoginPage = () => {

    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');

    const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleLogin = async () => {

        if (username && password) {

            const isLogged = await auth.signin(username, password);

            if (isLogged) {
                //lembrando que o nodemon tem delay de 1000ms
                //então settimeout precisa verificar acima de 1000ms

                setTimeout(() => {
                    navigate('/')
                    window.location.href = window.location.href;
                }, 1500)



            } else {
                alert('Usuário ou senha inválido, Tente novamente!')
            }

        }
    }

    return (
        <div>
            <br />
            <h2>Login</h2>
            <br />
            <C.Body>
                <input type="text" value={username}
                    onChange={handleUserInput}
                    className="form-control"
                    placeholder="Enter Username"
                />
                <br />
                <input type="password" value={password}
                    onChange={handlePasswordInput}
                    className="form-control"
                    name="password" placeholder="Enter Password"
                />
                <br />
                <button onClick={handleLogin}>Logar</button>
            </C.Body>
        </div>
    );
}