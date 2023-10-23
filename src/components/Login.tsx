import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [message, setMessage] = useState();
  const [message, setMessage] = useState<string | undefined>();
  const navigate = useNavigate(); // Get the navigation function

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> =>  {
    e.preventDefault();

    // Check if the email and password fields are not empty
    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setMessage(data.message);

        // Set the authentication token in a cookie
        Cookies.set('authToken', data.token, { expires: 1 / 24 }); // Token expires in 1 hour (adjust as needed)

        // Redirect to the Multi-step form page (Page 4)
        navigate('/submissions'); // Redirect to the "/submissions" page
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred');
    }
  };

  // Handle navigation to the registration page
  const handleRegisterClick = () => {
    navigate('/register'); // Redirect to the "/register" page
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Login Page</h1>
      <form onSubmit={(e)=>handleSubmit(e)} className="space-y-4">
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
          className="w-full bg-blue-500 text-white hover-bg-blue-600 rounded-md p-2"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleRegisterClick}
          className="w-full bg-green-500 text-white hover-bg-green-600 rounded-md p-2"
        >
          Register
        </button>
        {message && <p className="text-red-600 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
