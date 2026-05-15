import {createContext, useState} from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isInitialized, setIsInitialized] = useState(false)

    return(
        <AuthContext.Provider value={{user, setUser, loading, setLoading, isInitialized, setIsInitialized}}>
            {children}
        </AuthContext.Provider>
    )
}
