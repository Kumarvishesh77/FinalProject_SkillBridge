import { useContext } from "react";
import { ProfileContext } from "../profile.context";
import { getProfile, updateProfile } from "../services/profile.api";

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }

    const { profile, setProfile, profileLoading, setProfileLoading } = context;

    const fetchProfile = async () => {
        setProfileLoading(true);
        try {
            const data = await getProfile();
            if (data.success) {
                setProfile(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdateProfile = async (profileData) => {
        setProfileLoading(true);
        try {
            const data = await updateProfile(profileData);
            if (data.success) {
                setProfile(data.data);
                return { success: true, data: data.data };
            }
            return { success: false, message: data.message };
        } catch (err) {
            console.error("Profile update failed:", err);
            return { success: false, message: err.response?.data?.message || "Update failed" };
        } finally {
            setProfileLoading(false);
        }
    };

    return { profile, profileLoading, fetchProfile, handleUpdateProfile };
};
