import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      loginUser(data);
      navigate(data.role === 'kitchen' ? '/kitchen' : '/tables');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card">
        <h1 className="login-brand">
          <img src="/logo-cafemanager.svg" alt="CafeManager" className="login-brand-logo" />
          CafeManager
        </h1>
        <p className="subtitle">Restaurant Management System</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="admin@cafe.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="demo-accounts">
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin@cafe.com / admin123</p>
          <p>Waiter: waiter@cafe.com / waiter123</p>
          <p>Kitchen: kitchen@cafe.com / kitchen123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
