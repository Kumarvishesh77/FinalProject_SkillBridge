import React, { useState } from 'react'
import "./auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/user.Auth'
import { Mail, Lock, Building, Eye, EyeOff } from 'lucide-react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [orgId, setOrgId] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password, orgId })
        navigate('/home')
    }

    if (loading) {
        return <div className="loading-screen"><h1>Loading ...</h1></div>
    }

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2>Login</h2>
                <div className="enterprise-policy">
                    <p>Authorized Users Only</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type='text'
                            id='orgId'
                            value={orgId}
                            onChange={(e) => setOrgId(e.target.value)}
                            placeholder=' '
                            required
                        />
                        <label htmlFor='orgId'>Organization ID <span className="required">*</span></label>
                        <span className="icon"><Building size={20} /></span>
                    </div>

                    <div className="input-box">
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=' '
                            required
                        />
                        <label htmlFor='email'>Corporate Email <span className="required">*</span></label>
                        <span className="icon"><Mail size={20} /></span>
                    </div>

                    <div className="input-box">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=' '
                            required
                        />
                        <label htmlFor='password'>Password <span className="required">*</span></label>
                        <span 
                            className="icon toggle-password" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" /> Remember me</label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit" className='btn-submit'>Login</button>
                </form>

                <p className="footer-text">
                    Don't have an account? <Link to="/register">Enrollment here</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;
