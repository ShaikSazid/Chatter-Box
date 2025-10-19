import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signup({ username, email, password });
      navigate('/');
    } catch (err: any) {
      if (err.response) {
        // Backend returned an error (e.g., 400, 409)
        setError(err.response.data?.msg || 'Could not create account. Please try again.');
      } else if (err.request) {
        // Request was made but no response was received (Network Error)
        setError('Cannot connect to server. Please check your connection or if the server is running.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
      console.error("Signup error:", err);
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
      <h2 className="text-3xl font-bold text-center text-white mb-2">Create an Account</h2>
      <p className="text-center text-gray-400 mb-8">Start your journey with ChatterBox</p>
      {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          Sign Up
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
          Login
        </Link>
      </p>
    </motion.div>
  );
};

export default SignupPage;