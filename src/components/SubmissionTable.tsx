//@ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Submission {
  name: string;
  email: string;
  phone: string;
  address: {
    al1: string;
    al2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  files: string[];
  files2: File[];
  selectedOptions: string[];
  geolocationStatus: string;
  submitDate: string;
}

const SubmissionTable: React.FC = () => {
  const authToken: string | undefined = Cookies.get('authToken');

  if (!authToken) {
    return <Navigate to="/login" />;
  }

  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [startDate, setStartDate] = useState<string | null>(null);
  // const [endDate, setEndDate] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  
  
  
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filenames, setFilenames] = useState<string[]>([]);
  const navigate = useNavigate();
  let ind: number = -1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  async function fetchSubmissions() {
      try {
        const resp = await fetch('https://funny-rose-beret.cyclic.app/submissions');
        const dat = await resp.json();
        const fin = dat.submissions;
        setSubmissions(fin);
      } catch (error) {
        console.error(error);
      }
    }

  useEffect(() => {
    fetchSubmissions();
    fetchSubmissions();
    fetchSubmissions();
    // const fetchDataInterval = setInterval(fetchSubmissions, 100);
    // return () => clearInterval(fetchDataInterval);
  }, []);

  const handleRefresh =()=>{
    fetchSubmissions();
  }

  // useEffect(() => {
  //   async function fetchFilenames() {
  //     try {
  //       const resp = await fetch('http://localhost:3000/filenames');
  //       const dat = await resp.json();
  //       const fin = dat.filenames;
  //       setFilenames(fin);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   fetchFilenames();
  // }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    navigate('/login');
  };

  const filteredData = submissions.filter((data) => {
    const name = data.name.toLowerCase();
    const email = data.email.toLowerCase();
    const submissionDate = new Date(data.submitDate);

    const isNameMatch = name.includes(searchTerm.toLowerCase());
    const isEmailMatch = email.includes(searchTerm.toLowerCase());
    const isDateInRange =
      (!startDate || submissionDate >= new Date(startDate)) &&
      (!endDate || submissionDate <= new Date(endDate));

    return (isNameMatch || isEmailMatch) && isDateInRange;
  });

  return (
    <div className="pl-1">
      <h1 className="text-2xl font-bold mb-4">Submission Table</h1>
      <button onClick={handleRefresh} className="bg-blue-500 text-white hover:bg-green-600 rounded-md p-2 text-center">Refresh</button>
      <div>
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 p-2"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          className="border border-gray-300 p-2"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          className="border border-gray-300 p-2"
        />
      </div>
      <div className="mb-4 mt-4 ml-2">
        <Link to="/form" className="bg-blue-500 text-white hover:bg-blue-600 rounded-md p-2">
          New
        </Link>
      </div>
      <table className="border border-collapse w-full">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Files</th>
            <th className="border p-2">Selected Options</th>
            <th className="border p-2">Geolocation Status</th>
            <th className="border p-2">Submission Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data, index) => {
            const add = data.address;
            const address =
              add.al1 + ', ' + add.al2 + ', ' + add.city + ', ' + add.state + ', ' + add.pincode + ', ' + add.country + ', ';

            return (
              <tr key={index}>
                <td className="border p-2">{data.name}</td>
                <td className="border p-2">{data.email}</td>
                <td className="border p-2">{data.phone}</td>
                <td className="border p-2">{address}</td>
                <td className="border p-2">
                  {data.files.map((file, fileIndex) => {
                    ind = ind + 1;
                    return (
                      <p
                        key={fileIndex}
                        className="text-blue-500 hover:underline" 
                      >
                        {`${file} `}
                      </p>
                    );
                  })}
                </td>
                <td className="border p-2">{data.selectedOptions.join(', ')}</td>
                <td className="border p-2">{data.geolocationStatus}</td>
                <td className="border p-2">{formatDate(data.submitDate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button
          onClick={handleLogout}
          className="absolute top-5 right-5 bg-red-500 text-white hover:bg-red-600 rounded-md p-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SubmissionTable;
