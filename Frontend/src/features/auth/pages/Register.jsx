import React, { useState } from 'react'
import "./auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/user.Auth'

const Register = () => {
    const { loading, handleRegister } = useAuth()
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ fullname, email, password })
        navigate('/home')
    }

    if (loading) {
        return <div className="loading-screen"><h1>Loading ...</h1></div>
    }

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2>Create Account</h2>
                <p className="description">Join us and start mastering your path.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor='fullname'>Full Name</label>
                        <input
                            onChange={(e) => setFullname(e.target.value)}
                            type='text' id='fullname' name='fullname' placeholder='Enter your full name' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor='email'>Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type='email' id='email' name='email' placeholder='name@example.com' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type='password' id='password' name='password' placeholder='Min. 8 characters' required />
                    </div>

                    <button type="submit" className='btn-submit'>Create Account</button>
                </form>

                <p className="footer-text">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Register;
