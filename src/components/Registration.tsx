import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if the name, email, and password fields are not empty
    if (!name || !email || !password) {
      setMessage('Name, email, and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.status === 201) {
        setMessage('Registration successful. Please log in.');
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Registration Page</h1>
      <form onSubmit={handleRegistration} className="space-y-4">
        <div>
          <label className="text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-md p-2"
        >
          Register
        </button>
        <p className="text-red-600 text-center">{message}</p>
      </form>
      <div className="text-center mt-4">
        <button
          onClick={() => navigate('/login')}
          className="text-blue-500 hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Registration;
