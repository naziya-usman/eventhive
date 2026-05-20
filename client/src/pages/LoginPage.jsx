import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { setAuth } from '../utils/auth';
import { getApiErrorMessage } from '../utils/errorMessage';
import AuthEventVisual from '../components/AuthEventVisual';
import '../styles/LoginPage.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      setAuth(user, token);
      
      // Using alert for success notification as requested "show a success toast" 
      // but without a specific toast library mentioned, I'll use alert or just navigate.
      // I will assume alert is acceptable or just proceed with navigation.
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Login to your EventHive account</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "login-error" : undefined}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "login-error" : undefined}
              required
            />
          </div>
          
          {error && <p id="login-error" className="error-message">{error}</p>}
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
      <AuthEventVisual />
    </div>
  );
};

export default LoginPage;
