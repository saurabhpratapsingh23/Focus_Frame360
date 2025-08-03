import React, { useState } from 'react';
import logo from '../assets/logo/FocusFrame360.png'
// import { mockLogin } from '../lib/mockAPIData'; // Removed mockLogin import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';




const EmployeeLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // --- Real API call (POST) ---
      const response = await fetch(`${API_BASE_URL}/pms/api/e/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Invalid credentials or server error');
      }
      const result = await response.json();
      if (result && result.e_active) {
        toast.success('Successfully logged in!');
        // Store user information for use in other components
        sessionStorage.setItem('currentUser', JSON.stringify(result));
        sessionStorage.setItem('lastLoginTime', new Date().toISOString());
        setTimeout(() => {
          if (rememberMe) {
            sessionStorage.setItem('savedUsername', username);
            sessionStorage.setItem('savedPassword', password);
            toast.success('Credentials saved!');
          }
          navigate('/app/weeklysummary');
        }, 500);
      } else {
        toast.error('Invalid username or password');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setUsername('');
      setPassword(''); // Always clear password after submit
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md text-center">
        <img
          src={logo}
          alt="Company Logo"
          className="mx-auto mb-8 h-15"
        />
        <h5 className="mb-4 text-lg font-bold text-gray-800">Employee Login</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 text-left">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">Remember Me</label>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-4">
            <a href="/forgetPassword" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
