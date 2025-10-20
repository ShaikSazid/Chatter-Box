import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await login(data);
    } catch (error: any) {
      setApiError(error.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
      {apiError && <p className="text-red-400 text-center text-sm -mt-4 mb-4">{apiError}</p>}
      <Input
        label="Email Address"
        type="email"
        autoComplete="email"
        icon={<Icon name="envelope" />}
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message as string}
      />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        icon={<Icon name={showPassword ? 'eye-slash' : 'eye'} />}
        onIconClick={() => setShowPassword(!showPassword)}
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message as string}
      />
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading}>
          Log In
        </Button>
      </div>
    </form>
  );
};

export default LoginPage;
