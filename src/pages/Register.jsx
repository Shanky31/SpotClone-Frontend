import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default is user, can be artist
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ userName, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)'}}>
      <div className="glass-panel" style={{width: '100%', maxWidth: 400, padding: 32}}>
        <h1 className="h2" style={{textAlign: 'center', marginBottom: 24}}>Sign up to SpotClone</h1>
        {error && <p className="text-danger" style={{marginBottom: 16, textAlign: 'center'}}>{error}</p>}
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div>
            <label style={{display: 'block', marginBottom: 8, color: 'var(--text-secondary)'}}>User Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="User Name" 
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
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
          <div>
            <label style={{display: 'block', marginBottom: 8, color: 'var(--text-secondary)'}}>Create Account As</label>
            <select 
              className="input-field" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User (Listener)</option>
              <option value="artist">Artist (Creator)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{marginTop: 8}}>Sign Up</button>
        </form>
        <p style={{textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--text-primary)', textDecoration: 'underline'}}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
