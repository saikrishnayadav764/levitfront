import React, { useState, useEffect } from 'react';
import { useFormData } from '../context/FormDataContext';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface MultiFileUploadProps {
  handleNext: () => void;
  handleCancel: () => void;
  handlePrevious: () => void;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  handleNext,
  handleCancel,
  handlePrevious,
}) => {
  const authToken = Cookies.get('authToken');

  if (!authToken) {
    return <Navigate to="/login" />;
  }
  const { formData, setFormData } = useFormData();
  const [geolocationStatus, setGeolocationStatus] = useState<string>("Getting geolocation...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setGeolocationStatus(`Geolocation Captured: Lat ${latitude}, Long ${longitude}`);
          const updatedFormData = {
            ...formData,
            geolocationStatus: `Lat ${latitude}, Long ${longitude}`,
          };
          setFormData(updatedFormData);
        },
        (error: GeolocationPositionError) => {
          setGeolocationStatus(`Geolocation capture failed: ${error.message}`);
          console.error("Geolocation capture failed:", error);
        }
      );
    } else {
      setGeolocationStatus("Geolocation is not available in this browser.");
    }
  }, [formData, setFormData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files) { 
      const maxFileCount = 3;
      const allowedTypes = ['image/png', 'application/pdf'];
    
      if (formData.files2.length + files.length > maxFileCount) {
        alert(`You can upload a maximum of ${maxFileCount} files.`);
        return;
      }
    
      for (const file of Array.from(files)) {
        if (!allowedTypes.includes(file.type)) {
          alert('Invalid file type. Allowed types are PNG and PDF.');
          return;
        }
      }
    
      // Update the formData with the new files
      const updatedFormData = {
        ...formData,
        files2: [...formData.files2, ...Array.from(files)],
      };
    
      setFormData(updatedFormData);
      console.dir(updatedFormData);
    }
  };
  


  return (
    <div className="p-6 space-y-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Step 2: Multi-File Upload</h2>
      <form className="space-y-4">
        <div>
          <label className="text-gray-700">File Upload (PNG and PDF)</label>
          <input
            type="file"
            accept=".png, .pdf"
            multiple
            onChange={handleFileUpload}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="text-gray-700">Geolocation Status</label>
          <p className="text-gray-600">{geolocationStatus}</p>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="text-white bg-red-500 hover-bg-red-600 rounded-md p-2 px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrevious}
            className="text-white bg-blue-500 hover-bg-blue-600 rounded-md p-2 px-4"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="text-white bg-blue-500 hover-bg-blue-600 rounded-md p-2 px-4"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiFileUpload;
