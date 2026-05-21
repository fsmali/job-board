import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'freelancer',
  });
  const signupMutation = useMutation({
    mutationFn: async (newUser) => {
      const { data } = await axios.post('http://localhost:3000/signup', {
        user: newUser,
      });

      return data;
    },
    onSuccess: () => {
      navigate('/login');
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
      !formData.password.trim() ||
      !formData.password_confirmation.trim()
    ) {
      setFormError('All fields are required');
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setPasswordError('Passwords do not match');
      return;
    }

    signupMutation.mutate(formData);
  };

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {/* <input
          type="password"
          name=" password_confirmation"
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChange={handleChange}
        /> */}
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChange={handleChange}
        />
        {formError && <p>{formError}</p>}
        {passwordError && <p>{passwordError}</p>}

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="freelancer">Freelancer</option>
          <option value="employer">Employer</option>
        </select>

        <button type="submit">
          {' '}
          {signupMutation.isPending ? 'Signing up...' : 'Signup'}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        {signupMutation.isError && (
          <p>Could not create account. Try another email.</p>
        )}
      </form>
    </div>
  );
}

export default SignupPage;
