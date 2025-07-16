import React, { useState } from 'react';
import axios from 'axios';

const LoginModalContent = ({ onClose, setIsLoggedIn }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup
        ? 'http://localhost:5000/api/auth/signup'
        : 'http://localhost:5000/api/auth/login';

      const res = await axios.post(url, form);

      // ✅ Store token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setMessage(`${isSignup ? 'Signup' : 'Login'} successful!`);

      // ✅ Inform parent component about login
      setIsLoggedIn(true);

      // ✅ Close modal
      onClose();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>{isSignup ? 'Sign Up' : 'Login'}</h3>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            name="name"
            placeholder="Username"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      <p>{message}</p>
      <p>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Login' : 'Sign up'}
        </span>
      </p>
    </div>
  );
};

export default LoginModalContent;
