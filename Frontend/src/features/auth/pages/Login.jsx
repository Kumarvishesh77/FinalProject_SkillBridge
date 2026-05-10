import React, { useState } from 'react'
import "./auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/user.Auth'


const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/home')
    }

    if (loading) {
        return <div className="loading-screen"><h1>Loading ...</h1></div>
    }


    return (
        <div className="auth-page">
            <div className="form-container">
                <h2>Welcome Back</h2>
                <p className="description">Login to continue your journey.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor='email'>Email Address</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type='email' id='email' name='email' placeholder='name@example.com' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type='password' id='password' name='password' placeholder='Enter your password' required />
                    </div>

                    <button type="submit" className='btn-submit'>Login</button>
                </form>

                <p className="footer-text">Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>
    )
}

export default Login;
