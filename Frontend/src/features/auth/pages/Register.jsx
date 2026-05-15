import React, { useState } from 'react'
import "./auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/user.Auth'
import { User, Mail, Eye, EyeOff, Users } from 'lucide-react'

const Register = () => {
    const { loading, handleRegister } = useAuth()
    const navigate = useNavigate();

    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [orgId, setOrgId] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        await handleRegister({ fullname, email, password, age, gender, orgId })
        navigate('/home')
    }

    if (loading) {
        return <div className="loading-screen"><h1>Loading ...</h1></div>
    }

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2>Employee Enrollment</h2>
                <p className="enterprise-policy-line" style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--primary-btn)', 
                    fontWeight: '500', 
                    marginBottom: '10px',
                    letterSpacing: '0.5px'
                }}>Authorized Personnel Only</p>
                
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
                        <span className="icon"><Users size={18} /></span>
                    </div>

                    <div className="input-box">
                        <input
                            type='text'
                            id='fullname'
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder=' '
                            required
                        />
                        <label htmlFor='fullname'>Full Name <span className="required">*</span></label>
                        <span className="icon"><User size={18} /></span>
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
                        <label htmlFor='email'>Email Address <span className="required">*</span></label>
                        <span className="icon"><Mail size={18} /></span>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="input-box" style={{ flex: 1 }}>
                            <input
                                type='number'
                                id='age'
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder=' '
                                required
                            />
                            <label htmlFor='age'>Age <span className="required">*</span></label>
                        </div>

                        <div className="input-box" style={{ flex: 1 }}>
                            <select
                                id='gender'
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                                className={gender ? 'has-value' : ''}
                            >
                                <option value="" disabled hidden></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                            <label htmlFor='gender'>Gender <span className="required">*</span></label>
                            <span className="icon"><Users size={18} /></span>
                        </div>
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
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                        <div className="input-helper">Min. 8 chars, A–Z, a–z, 0–9, @$!%</div>
                    </div>

                    <div className="input-box">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=' '
                            required
                        />
                        <label htmlFor='confirmPassword'>Confirm Password <span className="required">*</span></label>
                        <span 
                            className="icon toggle-password" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>

                    <div className="remember-forgot">
                        <label style={{ fontSize: '0.8rem' }}>
                            <input type="checkbox" required /> I agree to the Terms & Conditions
                        </label>
                    </div>

                    <button type="submit" className='btn-submit'>Enrollment</button>
                </form>

                <p className="footer-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register;
