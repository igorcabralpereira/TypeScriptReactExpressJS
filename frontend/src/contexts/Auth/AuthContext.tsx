import { createContext } from 'react'
import { User } from '../../types/User';
import { Token } from '../../types/Token'

export type AuthContextType = {
    user: User | null;
    authToken: Token | null;
    signin: (username: string, password: string) => Promise<Boolean>;
    signout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);