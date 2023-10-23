import React, { FC } from 'react';
import { useFormData } from '../context/FormDataContext';
import { Navigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

interface MultiFieldSelectProps {
  handleCancel: () => void;
  handlePrevious: () => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const MultiFieldSelect: FC<MultiFieldSelectProps> = ({ handleCancel, handlePrevious, handleSubmit }) => {
  const authToken: string | undefined = Cookies.get('authToken');

  if (!authToken) {
    return <Navigate to="/login" />;
  }
  const { formData, setFormData } = useFormData();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions: string[] = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, selectedOptions });
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Step 3: Multi-Field Select Dropdown</h2>
      <form className="space-y-4">
        <div>
          <label className="text-gray-700">Select Options</label>
          <select
            multiple
            size={3}
            value={formData.selectedOptions}
            onChange={handleSelectChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="text-white bg-red-500 hover:bg-red-600 rounded-md p-2 px-4"
          >
            Cancel
          </button>
          <button
            onClick={handlePrevious}
            className="text-white bg-blue-500 hover:bg-blue-600 rounded-md p-2 px-4"
          >
            Previous
          </button>
          <Link to="/submissions">
          <button
            onClick={(e)=>handleSubmit(e)}
            className="text-white bg-blue-500 hover:bg-blue-600 rounded-md p-2 px-4"
          >
            Submit
          </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default MultiFieldSelect;
