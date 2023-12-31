import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Navigate} from 'react-router-dom';

const Login = () => {
  const authToken: string | undefined = Cookies.get('authToken');
  if (authToken) {
    return <Navigate to="/form" />;
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | undefined>();
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> =>  {
    e.preventDefault();


    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('https://funny-rose-beret.cyclic.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setMessage(data.message);


        Cookies.set('authToken', data.token, { expires: 1 / 24 }); // Token expires in 1 hour 

        navigate('/form'); 
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred');
    }
  };


  const handleRegisterClick = () => {
    navigate('/register'); 
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
