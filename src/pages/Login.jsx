import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast.success("Login successful");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)'}}>
      <div className="glass-panel" style={{width: '100%', maxWidth: 400, padding: 32}}>
        <h1 className="h2" style={{textAlign: 'center', marginBottom: 24}}>Log in to SpotClone</h1>
        {error && <p className="text-danger" style={{marginBottom: 16, textAlign: 'center'}}>{error}</p>}
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div>
            <label style={{display: 'block', marginBottom: 8, color: 'var(--text-secondary)'}}>Email address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: 8, color: 'var(--text-secondary)'}}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{marginTop: 8}}>Log In</button>
        </form>
        <p style={{textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)'}}>
          Don't have an account? <Link to="/register" style={{color: 'var(--text-primary)', textDecoration: 'underline'}}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
