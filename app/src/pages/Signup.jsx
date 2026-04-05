import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signUpWithEmail, loginWithGoogle } from '../config/authUtils';
import './Login.css';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await signUpWithEmail(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    const result = await loginWithGoogle();
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page">
      <Link to="/" className="login-home-btn" title="Back to home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
      <div className="login-container-minimal">
        <div className="login-header-minimal">
          <h1>create account</h1>
          <p>join the qpg flow community</p>
        </div>
        
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}
        
        <form className="login-form-minimal" onSubmit={handleSignup}>
          <div className="input-group-minimal">
            <input 
              type="email" 
              placeholder="enter your email" 
              className="input-minimal" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group-minimal">
            <input 
              type="password" 
              placeholder="create a password" 
              className="input-minimal" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group-minimal password-group">
            <input 
              type="password" 
              placeholder="confirm password" 
              className="input-minimal input-password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="submit-btn-minimal"
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
        
        <div className="divider-minimal">
          <span>or</span>
        </div>
        
        <button 
          className="google-btn-minimal" 
          type="button" 
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <div className="google-content-left">
            <svg viewBox="0 0 24 24" className="google-icon-minimal">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{loading ? 'signing up...' : 'continue with google'}</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon-minimal">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="login-footer-minimal">
          already have an account? <Link to="/login">sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
