import React, { useState } from 'react';
import { useSignUpEmailPassword } from '@nhost/react';
import { Link, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUpEmailPassword, isLoading, isSuccess, isError, error } = useSignUpEmailPassword();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { isSuccess: signUpSuccess } = await signUpEmailPassword(email, password, {
      displayName: email.split('@')[0],
    });
    if (signUpSuccess) {
      toast.success('Account created! Please check your email to verify.');
    }
  };

  if (isSuccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
      <Toaster />
      <div className="bg-white dark:bg-[#181829] px-12 py-16 rounded-3xl shadow-2xl max-w-xl w-full">
        {/* Large Gradient Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">Sign up for Subspace AI Chatbot</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              placeholder="Email address"
              autoFocus
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              placeholder="Password"
            />
          </div>
          {isError && (
            <div className="text-pink-600 dark:text-pink-400 font-semibold text-center">{error?.message || 'An unknown error occurred.'}</div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full font-bold shadow-md hover:brightness-110 transition-transform active:scale-95 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
          Or{' '}
          <Link to="/sign-in" className="text-indigo-500 hover:underline font-semibold">
            Account Already Exists? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
