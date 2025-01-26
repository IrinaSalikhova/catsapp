import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose, setIsLoggedIn, setUserRole }) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // For routing to other pages after login

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

    return (
        <div className="modal-overlay">
            <div className="login-form-modal">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            autocomplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            autocomplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Login;
