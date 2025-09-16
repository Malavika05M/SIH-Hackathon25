'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadhaar: ''
  });

  const router = useRouter();

  const handleLogin = async () => {
    console.log('Login attempt:', loginData);
    // Add your login logic here
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login successful! Redirecting to home page.');
      router.push('/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async () => {
    console.log('Signup attempt:', signupData);
    // Add your signup logic here
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Signup successful! Redirecting to home page.');
      router.push('/home');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600">
      <div className="fixed top-0 left-0 right-0 bg-slate-800 px-5 py-3 z-50">
        <div className="flex items-center">
          <div className="w-8 h-5 mr-3 bg-gradient-to-b from-orange-500 via-white to-green-600 border border-gray-300"></div>
          <span className="text-white text-sm font-medium">भारत सरकार / Government Of India</span>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-white text-sm">English</span>
            <span className="text-orange-400 text-sm">Youth Registration</span>
            <span className="text-orange-400 text-sm">Login</span>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 px-4 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex">
          
          <div className="flex-1 bg-gradient-to-br from-orange-400 to-orange-600 p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-6">Welcome to</h1>
              <h2 className="text-5xl font-bold mb-8">Government Portal</h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Access government services, internship opportunities, and financial assistance programs. 
                Seed your bank account with Aadhaar for seamless transactions.
              </p>
              <div className="mt-12 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Secure Aadhaar Integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Direct Benefit Transfer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Internship Opportunities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-12">
            <div className="max-w-md mx-auto">
              
              <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${
                    activeTab === 'login'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${
                    activeTab === 'signup'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {activeTab === 'login' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-orange-600 hover:text-orange-500">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors duration-200 transform hover:scale-[1.02]"
                  >
                    Login to Portal
                  </button>
                </div>
              )}

              {activeTab === 'signup' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                        placeholder="Full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      value={signupData.aadhaar}
                      onChange={(e) => setSignupData({...signupData, aadhaar: e.target.value})}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                      placeholder="12-digit Aadhaar number"
                      maxLength={12}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                        placeholder="Password"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1" required />
                    <span className="text-sm text-gray-600">
                      I agree to the <button type="button" className="text-orange-600 hover:text-orange-500">Terms of Service</button> and <button type="button" className="text-orange-600 hover:text-orange-500">Privacy Policy</button>
                    </span>
                  </div>

                  <button
                    onClick={handleSignup}
                    className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors duration-200 transform hover:scale-[1.02]"
                  >
                    Create Account
                  </button>
                </div>
              )}

              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">or continue with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-5 h-5 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm font-medium text-black">Google</span>
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-5 h-5 bg-orange-600 rounded mr-2"></div>
                  <span className="text-sm font-medium text-black">DigiLocker</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}