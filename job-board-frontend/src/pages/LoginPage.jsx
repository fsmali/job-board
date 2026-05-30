import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthBackground from '../components/AuthBackground';
import api from '../api/axios';
import { useLocation } from 'react-router-dom';

function LoginPage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });

  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      const { data } = await api.post('/login', loginData);

      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <main className="auth-page" aria-labelledby="login-title">
      <AuthBackground type="login" />

      <section className="auth-card" aria-describedby="login-description">
        <h1 id="login-title">Login</h1>

        {loginMutation.isError && (
          <div className="error" role="alert" aria-live="assertive">
            Login failed. Please check your email and password.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>

          <p>
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
