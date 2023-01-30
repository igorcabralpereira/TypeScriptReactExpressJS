import { useState, useEffect } from 'react';
import { User } from '../../types/User';
import { Token } from '../../types/Token'
import { AuthContext } from "./AuthContext";
import jwtDecode from 'jwt-decode';
import { variables } from '../../Variables'


export const AuthProvider = ({ children }: { children: JSX.Element }) => {

    const [user, setUser] = useState<User | null>(null)
    const [authToken, setAuthToken] = useState<Token | null>(

        JSON.parse(localStorage.getItem("authToken") ?? '{}')
    )
    const [loading, setLoading] = useState(true)

    const validateToken = async () => {

        //console.log('Chamadas do update token refresh')
        const response = await fetch(variables.API_URL + 'api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authToken?.refresh })
            // Esse novo token de atualização de acesso será fornecido por meio da chave “refresh”
            // na resposta JSON.
        })

        const data = await response.json()

        //console.log('entrei no refresh', response)

        if (response.status === 200 || response.status === 201) {
            //console.log('entrei no status refresh', response.status)
            //alert('entrei aqui')
            setAuthToken(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))

        } else {
            signout();
        }

        if (loading) {
            setLoading(false)
        }
    }

    //signin tem que retornar true ou false pois minha Promise<Boolean> requer essa verificação!
    const signin = async (username: string, password: string) => {

        //console.log(username);
        //console.log(password);

        const response = await fetch(variables.API_URL + 'api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })

        const data = await response.json()
        //console.log(data);

        //console.log('Acesso', data.access)
        //console.log('entrei no response status', response)

        if (response.status === 200 || response.status === 201) {
            setUser(jwtDecode(data.access))
            setAuthToken(data)
            localStorage.setItem('authToken', JSON.stringify(data))
            return true;
        } else {
            signout();
            return false;
        }

    }

    const signout = async () => {
        setUser(null);
        setAuthToken(null)
        localStorage.removeItem('authToken')
    }

    useEffect(() => {

        if (loading) {
            validateToken()
        }

        //const storageData = JSON.parse(localStorage.getItem('authToken'));

        let fourMinutes = 1000 * 60 * 4     // 4 minutos equivale a 240000 milissegundo

        let interval = setInterval(() => {

            if (authToken) {
                validateToken()
            }


        }, fourMinutes)
        return () => clearInterval(interval)

    }, [authToken, loading])

    //const setToken = (token: string) => {
    //    localStorage.setItem('authToken', JSON.stringify(token));
    //}

    return (
        <AuthContext.Provider value={{ user, authToken, signin, signout }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
}