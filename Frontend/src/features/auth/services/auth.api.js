import axios from "axios";

const api = axios.create({
    baseURL: '',
    withCredentials: true
})

export async function register({ fullname, email, password }) {
    const response = await api.post('/api/auth/register', { fullname, email, password }, { withCredentials: true })
    return response.data;
}

export async function login({ email, password }) {
    const response = await api.post('/api/auth/login', { email, password }, { withCredentials: true })
    return response.data;
}

export async function logout() {
    const response = await api.post('/api/auth/logout', {}, { withCredentials: true })
    return response.data;
}

export async function getMe() {
    const response = await api.get('/api/auth/get-me', { withCredentials: true })
    return response.data;
}
