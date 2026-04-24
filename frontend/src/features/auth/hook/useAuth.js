import { useContext } from "react";
import { authContext } from "../auth.context";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../services/auth.api";


export const useAuth = () =>{
    const context = useContext(authContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const {user, setUser, loading, setLoading} = context;

    const handleRegister = async (userData) => {
        setLoading(true);
        try {
            const response = await registerUser(userData);
            setUser(response.user);
            // return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async (userData) => {
        setLoading(true);
        try {
            const response = await loginUser(userData);
            setUser(response.user);
            // return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await logoutUser();
            setUser(null);
            // return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetCurrentUser = async () => {
        setLoading(true);
        try {
            const response = await getCurrentUser();
            setUser(response.user);
            // return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    return {user, loading, handleRegister, handleLogin, handleLogout, handleGetCurrentUser}
}