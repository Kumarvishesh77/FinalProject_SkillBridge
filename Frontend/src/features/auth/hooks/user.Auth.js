import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;


    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }
    const handleRegister = async ({ fullname, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ fullname, email, password });
            setUser(data.user);
        } catch (err) {
            console.error("Registration failed:", err);
        } finally {
            setLoading(false);
        }


    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        const getAndSetUser = async()=>{
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                console.error("Initialization failed:", err);
            } finally {
                setLoading(false);
            }
        }
        if (!user) {
            getAndSetUser();
        }
    }, [setUser, setLoading, user]);

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
