import { createContext, useState, useContext } from 'react'

export const ProfileContext = createContext()

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)

    return (
        <ProfileContext.Provider value={{ profile, setProfile, profileLoading, setProfileLoading }}>
            {children}
        </ProfileContext.Provider>
    )
}
