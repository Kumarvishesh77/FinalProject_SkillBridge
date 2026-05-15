import { useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading, isInitialized, setIsInitialized } = context;

    const handleLogin = useCallback(async ({ email, password, orgId }) => {
        setLoading(true);
        try {
            const data = await login({ email, password, orgId });
            setUser(data.user);
            setIsInitialized(true);
        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }, [setUser, setLoading, setIsInitialized]);

    const handleRegister = useCallback(async ({ fullname, email, password, age, gender, orgId }) => {
        setLoading(true);
        try {
            const data = await register({ fullname, email, password, age, gender, orgId });
            setUser(data.user);
            setIsInitialized(true);
        } catch (err) {
            console.error("Registration failed:", err);
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading, setIsInitialized]);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading]);

    useEffect(() => {
        const getAndSetUser = async () => {
            if (isInitialized) return;
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                // If 401, it just means no user is logged in, which is fine
                if (err.response?.status !== 401) {
                    console.error("Initialization failed:", err);
                }
                setUser(null);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        }
        
        getAndSetUser();
    }, [isInitialized, setUser, setLoading, setIsInitialized]);

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
