import api from "../../../services/api";

export async function getProfile() {
    const response = await api.get('/api/profile/me')
    return response.data;
}

export async function updateProfile(profileData) {
    const response = await api.put('/api/profile/update', profileData)
    return response.data;
}

export async function uploadAvatar(avatarUrl) {
    const response = await api.post('/api/profile/avatar', { avatarUrl })
    return response.data;
}
