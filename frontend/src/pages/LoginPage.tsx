import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      if (err.response) {
        // Backend returned an error (e.g., 400, 401)
        setError(err.response.data?.msg || 'Invalid credentials. Please try again.');
      } else if (err.request) {
        // Request was made but no response was received (Network Error)
        setError('Cannot connect to server. Please check your connection or if the server is running.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
      <p className="text-center text-gray-400 mb-8">Sign in to continue to ChatterBox</p>
      {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Login
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginPage;