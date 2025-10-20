import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';

const SignupPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // The backend expects a single `username` field.
      await signup({ username: data.fullName, email: data.email, password: data.password });
    } catch (error: any) {
      setApiError(error.response?.data?.msg || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
      {apiError && <p className="text-red-400 text-center text-sm -mt-4 mb-4">{apiError}</p>}
      <Input
        label="Full Name"
        type="text"
        autoComplete="name"
        {...register('fullName', { required: 'Full name is required' })}
        error={errors.fullName?.message as string}
      />
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
        autoComplete="new-password"
        icon={<Icon name={showPassword ? 'eye-slash' : 'eye'} />}
        onIconClick={() => setShowPassword(!showPassword)}
        {...register('password', { 
            required: 'Password is required',
            minLength: { value: 4, message: 'Password must be at least 4 characters'}
        })}
        error={errors.password?.message as string}
      />
        <div className="flex items-center">
            <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-gray-400 focus:ring-gray-500"
                {...register('terms', { required: 'You must accept the terms' })}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                I accept the <a href="#" className="font-medium hover:text-white">terms & conditions</a>
            </label>
        </div>
        {errors.terms && <p className="-mt-8 text-sm text-red-400">{errors.terms.message as string}</p>}
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading}>
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default SignupPage;