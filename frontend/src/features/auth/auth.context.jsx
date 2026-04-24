import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "./services/auth.api";



export const authContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser]= useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.user);
            } catch (error) {
                console.log(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkUser();    
    }, []); 

    return (
        <authContext.Provider value = {{user, setUser, loading, setLoading}}>
            {children}
        </authContext.Provider>
    )
}