import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { motion, AnimatePresence } from "framer-motion";

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
      await signup(data);
    } catch (error: any) {
      setApiError(error.response?.data?.msg || "Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="space-y-8"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* ✅ Fixed JSX error */}
      <AnimatePresence>
        {apiError && (
          <motion.p
            key="apiErrorSignup"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-center text-xs -mb-4"
          >
            {apiError}
          </motion.p>
        )}
      </AnimatePresence>

      <Input
        label="Username"
        type="text"
        autoComplete="username"
        icon={<Icon name="user" />}
        {...register("username", { required: "Username is required" })}
        error={errors.username?.message as string}
      />

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        icon={<Icon name="envelope" />}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
        })}
        error={errors.email?.message as string}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        icon={<Icon name={showPassword ? "eye-slash" : "eye"} />}
        onIconClick={() => setShowPassword(!showPassword)}
        {...register("password", { required: "Password is required" })}
        error={errors.password?.message as string}
      />

      <div className="pt-2">
        <Button type="submit" isLoading={isLoading} variant="primary">
          Sign Up
        </Button>
      </div>
    </motion.form>
  );
};

export default SignupPage;
