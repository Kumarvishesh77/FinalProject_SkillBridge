import api from "../../../services/api";

export async function register({ fullname, email, password, age, gender, orgId }) {
    const response = await api.post('/api/auth/register', { fullname, email, password, age, gender, orgId })
    return response.data;
}

export async function login({ email, password, orgId }) {
    const response = await api.post('/api/auth/login', { email, password, orgId })
    return response.data;
}

export async function logout() {
    const response = await api.post('/api/auth/logout', {})
    return response.data;
}

export async function getMe() {
    const response = await api.get('/api/auth/get-me')
    return response.data;
}
