import React, { useState } from 'react';
import { useSignInEmailPassword } from '@nhost/react';
import { Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInEmailPassword, isLoading, isSuccess, isError, error } = useSignInEmailPassword();

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signInEmailPassword(email, password);
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
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">
            Subspace AI Chatbot
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">Securely access your conversations and connect with your AI assistant.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
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
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full font-bold shadow-md hover:brightness-110 transition-transform active:scale-95 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
          Or{' '}
          <Link to="/sign-up" className="text-indigo-500 hover:underline font-semibold">
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
