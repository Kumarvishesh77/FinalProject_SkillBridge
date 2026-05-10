import axios from "axios";

const api = axios.create({
    baseURL: '',
    withCredentials: true
})

export async function getProfile() {
    const response = await api.get('/api/profile/me', { withCredentials: true })
    return response.data;
}

export async function updateProfile(profileData) {
    const response = await api.put('/api/profile/update', profileData, { withCredentials: true })
    return response.data;
}

export async function uploadAvatar(avatarUrl) {
    const response = await api.post('/api/profile/avatar', { avatarUrl }, { withCredentials: true })
    return response.data;
}
