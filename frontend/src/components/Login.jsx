import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

const Login = ({ onClose, setIsLoggedIn, setUserRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle between login and forgot password
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                setIsLoggedIn(true);
                setUserRole(data.role);
                if (data.role === 'admin') {
                    navigate('/adminpage');
                } else {
                    setError('Navigator page is not ready yet');
                }
                onClose(); // Close the modal
            } else {
                setError(data.message); // Show error message
            }
        } catch (error) {
            setError('An error occurred while logging in.');
            console.error(error);
        }
    };

    const handleForgotPassword = async () => {
        
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        try {
            console.log('Sending password reset email...');
            const response = await fetch('/api/users/sendpasswordreset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setError('Password reset email sent. Please check your inbox.');
            } else {
                setError(data.message || 'Failed to send password reset email.');
            }
        } catch (error) {
            setError('An error occurred while sending the password reset email.');
            console.error(error);
        }
    };

    return (
        <div className="modal-overlay-login">
            <div className="login-form-modal">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>{isForgotPassword ? 'Reset Password' : 'Login'}</h2>
                <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit}>
                    <div>
                        <label className='login-label' htmlFor="email">Email</label>
                        <input className='login-input-email'
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {!isForgotPassword && (
                        <div>
                            <label className='login-label' htmlFor="password">Password</label>
                            <input className='login-input-pass'
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <button className='login-button' type="submit">
                        {isForgotPassword ? 'Send Reset Link' : 'Submit'}
                    </button>
                </form>
                {!isForgotPassword && (
                    <p
                        style={{ color: 'blue', cursor: 'pointer', textAlign: 'center' }}
                        onClick={() => setIsForgotPassword(true)}
                    >
                        Forgot Password?
                    </p>
                )}
                {isForgotPassword && (
                    <p
                        style={{ color: 'blue', cursor: 'pointer', textAlign: 'center' }}
                        onClick={() => setIsForgotPassword(false)}
                    >
                        Back to Login
                    </p>
                )}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Login;