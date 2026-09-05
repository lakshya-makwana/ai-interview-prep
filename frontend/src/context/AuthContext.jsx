import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    function login(jwt) {

        localStorage.setItem("token", jwt);

        setToken(jwt);

    }

    function logout() {

        localStorage.removeItem("token");

        setToken(null);

    }

    return (

        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {

    return useContext(AuthContext);

}