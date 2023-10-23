import React, { FC, useState } from 'react';
import { useFormData } from '../context/FormDataContext';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface BasicDetailsProps {
  handleNext: () => void;
  handleCancel: () => void;
}

const BasicDetails: FC<BasicDetailsProps> = ({ handleNext, handleCancel }) => {
  const authToken: string | undefined = Cookies.get('authToken');

  if (!authToken) {
    return <Navigate to="/login" />;
  }
  const { formData, setFormData } = useFormData();

  const updateFormData = (key: string, value: string) => {
    // If the key is nested within the address object, update it accordingly
    if (key.startsWith('address.')) {
      const addressKey = key.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressKey]: value,
        },
      });
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Step 1: Basic Details</h2>
      <form>
        <div className="space-y-2">
          <label className="text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter name'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter email'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter 10-digit number'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.al1}
            onChange={(e) => updateFormData('address.al1', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter address Line 1'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            Address Line 2 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.al2}
            onChange={(e) => updateFormData('address.al2', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter address Line 2'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.city}
            onChange={(e) => updateFormData('address.city', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter city'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.state}
            onChange={(e) => updateFormData('address.state', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter state'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.pincode}
            onChange={(e) => updateFormData('address.pincode', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter 6-digit number'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.country}
            onChange={(e) => updateFormData('address.country', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder='Enter country'
            required
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handleCancel}
            className="text-white bg-red-500 hover-bg-red-600 rounded-md p-2 px-4 mt-2"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="text-white bg-blue-500 hover-bg-blue-600 rounded-md p-2 px-4 mt-2"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicDetails;