"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useLogin, useCurrentUser } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const loginMutation = useLogin();
  const { data: user } = useCurrentUser();
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      router.push("/");
    } catch (error: unknown) {
      setErrors({
        general: error instanceof Error ? error.message : "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 shadow-2xl border border-zinc-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
          Giriş Yap
        </h2>
        <p className="text-zinc-400 text-sm">ESOES platformuna hoş geldin!</p>
      </div>
      {errors.general && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{errors.general}</p>
        </div>
      )}
      <form className="space-y-7" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="text-zinc-200 text-sm font-semibold">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={cn(
              "bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2",
              errors.email && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="password" className="text-zinc-200 text-sm font-semibold">Şifre</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className={cn(
                "bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 pr-10",
                errors.password && "border-red-500 focus:ring-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10a9.969 9.969 0 01-7.071-2.929m2.121-2.121A9.969 9.969 0 012 12c0-5.523 4.477-10 10-10a9.969 9.969 0 017.071 2.929" /></svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">{errors.password}</p>
          )}
        </div>
        <button
          className="block h-11 w-full rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 font-semibold text-lg text-white shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Giriş yapılıyor...
            </span>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>
    </div>
  );
} 