import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for API call to send reset email
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <Header />
      <section className="flex-1 w-full min-w-full flex items-center justify-center py-12 m-0 p-0 box-border">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">Reset Your Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition"
              >
                Send Reset Link
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Back to{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ForgotPassword;