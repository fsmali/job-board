import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import api from '../api/axios';

function SignupPage() {
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
    role: 'freelancer',
  });

  const signupMutation = useMutation({
    mutationFn: async (newUser) => {
      const { data } = await api.post('/signup', {
        user: newUser,
      });
      return data;
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.errors?.join(', ') || 'Could not create account',
      );
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setPasswordError('');
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone_number.trim() ||
      !formData.password.trim() ||
      !formData.password_confirmation.trim()
    ) {
      setFormError('All fields are required');
      return;
    }
    const phoneRegex = /^[0-9+\s()-]+$/;

    if (!phoneRegex.test(formData.phone_number)) {
      setFormError('Please enter a valid phone number');
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])/;

    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        'Password must contain uppercase, number and special character',
      );
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setPasswordError('Passwords do not match');
      return;
    }

    signupMutation.mutate(formData);
  };

  return (
    <main className="auth-page" aria-labelledby="signup-title">
      <AuthBackground type="signup" />

      <section className="auth-card" aria-describedby="signup-description">
        <h1 id="signup-title">Create Account</h1>

        {formError && (
          <div className="error" role="alert" aria-live="assertive">
            {formError}
          </div>
        )}

        {passwordError && (
          <div className="error" role="alert" aria-live="assertive">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="phone_number">Phone number</label>

            <input
              id="phone_number"
              type="tel"
              name="phone_number"
              placeholder="Phone number"
              autoComplete="Phone number"
              value={formData.phone_number}
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
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-required="true"
            />
            <ul className="password-hint">
              <li> Minimum 8 characters</li>
              <li>one uppercase letter</li>
              <li>one number</li>
              <li>one number and one special character.</li>
            </ul>
          </div>

          <div>
            <label htmlFor="password_confirmation">Confirm password</label>

            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div>
            <fieldset className="role-group">
              <legend>Account type</legend>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="freelancer"
                  checked={formData.role === 'freelancer'}
                  onChange={handleChange}
                />
                Freelancer
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="employer"
                  checked={formData.role === 'employer'}
                  onChange={handleChange}
                />
                Employer
              </label>
            </fieldset>
          </div>

          <button type="submit" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? 'Creating account...' : 'Sign up'}
          </button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default SignupPage;
