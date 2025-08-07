import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Bg from '../assets/images/Bg.avif';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import register from '../assets/images/register.jpg';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { CountryData } from 'react-phone-input-2';



const Register: React.FC = () => {
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  company: '',
  contact: '',
  countrycode: '',      // Add this line
  termsAgreed: false,   // Change from 'terms' to 'termsAgreed'
});
const Navigate = useNavigate();
const [phoneError, setPhoneError] = useState<string | null>(null);
const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePhoneChange = (phone: string, country: CountryData) => {
    setFormData({
      ...formData,
      contact: phone.replace(`+${country.dialCode}`, ''),
      countrycode: `+${country.dialCode}`,
    });
    setPhoneError(null);
  };

const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      // Registration successful, redirect or show success
      alert('Registration successful! Please log in.');
      // Optionally: navigate('/login');
      if (data.user.role === 'ADMIN') {
        Navigate('/admin/dashboard');
      } else {
        Navigate('/user/dashboard');
      }
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <Header />

      {/* Register Section */}
      <section
        className="flex-1 w-full flex items-center justify-center py-12 mt-6 rounded-xl"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(59,130,246,0.85), rgba(124,58,237,0.85)), url(${Bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl w-full">
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">Create an account with SmartPulse</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>                
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Maureen Semenhyia"
                />
              </div>

              {/* Email */}
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
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Maureen@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                <input
                          type={showPassword ? 'text':'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="••••••••"
                        />
                      <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 -translate-y-1/2 right-2 p-1 text-gray-500 bg-white  focus:outline-none hover:text-gray-700 acitve:outline-none"
                            tabIndex={-1}
                      >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-7 pointer-events-none " />
                            ) : (
                              <EyeIcon className="h-5 w-7 pointer-events-none " />
                            )}
                      </button>
               </div>

              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Maureen IT Solutions"
                />
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <PhoneInput
                  country={'gh'}
                  value={formData.countrycode + formData.contact}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: 'contact',
                    required: true,
                    className:
                      'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary pl-14',
                  }}
                  containerClass="w-full"
                  buttonClass="border-r border-gray-300"
                  dropdownClass="max-h-60"
                  placeholder="Enter your phone number"
                  enableSearch={true}
                  containerStyle={{ position: 'relative' }}
                  buttonStyle={{
                    paddingRight: '8px',
                    background: 'white',
                    border: 'none',
                  }}
                  inputStyle={{
                    paddingLeft: '60px',
                  }}
                />
                {phoneError && <p className="mt-1 text-sm text-red-500">{phoneError}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="termsAgreed"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  required
                  className="mr-2"
                />
                <label htmlFor="termsAgreed" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition w-40 mx-auto block"
                >
                  Register
                </button>
              </div>
            </form>

            {/* OR */}
            <div className="flex items-center justify-center my-4">
              <hr className="w-full border-gray-300" />
              <span className="mx-2 text-gray-500">OR</span>
              <hr className="w-full border-gray-300" />
            </div>

            {/* Already have an account? */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have a SmartPulse account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
          <div className="hidden md:block md:w-1/2">
            <img src={register} alt="Register illustration" className="object-cover h-full w-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;