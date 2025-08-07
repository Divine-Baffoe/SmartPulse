import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Bg from '../assets/images/Bg.avif';
import register from '../assets/images/register.jpg';
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline';

interface FormData {
  email: string;
  password: string;
}

// Login Component
// This component handles user login functionality


const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


 

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:3000/api/auth/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Saved user:', data.user); // <-- Add this line
      // Redirect based on user role
      if (data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <Header />
      <section
        className="flex-1 w-full flex items-center justify-center py-12 mt-6 rounded-xl"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(59,130,246,0.85), rgba(124,58,237,0.85)), url(${Bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background 0.3s ease-in-out', // Smooth background transition
        }}
      >
        <div className="flex max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
          <div className="hidden md:block md:w-1/2">
            <img
              src={register}
              alt="Login illustration"
              className="object-cover h-full w-full transition-opacity duration-300 ease-in-out"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 pt-20">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">Log In to SmartPulse</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="Maureen@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                        placeholder="••••••••"
                      />

                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-1/2 -translate-y-1/2 right-2 p-1 text-gray-500 bg-white focus:outline-none hover:text-gray-700 acitve:outline-none"
                        tabIndex={-1} // Prevents button from being focused
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5 pointer-events-none" /> : <EyeIcon className="h-5 w-5 pointer-events-none" />}
                      </button>
                </div>
                
                <div className="text-right mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-40 mx-auto block bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition-all duration-300 ease-in-out ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </button>
              </div>
            </form>
            {/* OR */}
            <div className="flex items-center justify-center my-4">
              <hr className="w-full border-gray-300" />
              <span className="mx-2 text-gray-500">OR</span>
              <hr className="w-full border-gray-300" />
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don’t have a SmartPulse account?{' '}
              <Link to="/register" className="text-primary hover:underline transition-colors duration-200">
                Sign up
              </Link>
            </p>
          </div>
          
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;