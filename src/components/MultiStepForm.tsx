
import React, { useState,FC } from 'react';
import BasicDetails from './BasicDetails';
import MultiFieldSelect from './MultiFieldSelect';
import MultiFileUpload from './MultiFileUpload';
import { useNavigate, Navigate } from 'react-router-dom';
import { useFormData } from '../context/FormDataContext';
import Cookies from 'js-cookie';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: {
    [key: string]: string; 
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
  submitDate: Date;
}

interface MultiStepFormProps {
  step: number;
}

const MultiStepForm: FC<MultiStepFormProps> = ({ step }) => {
  const authToken: string | undefined = Cookies.get('authToken');

  if (!authToken) {
    return <Navigate to="/login" />;
  }
  const { formData, setFormData } = useFormData();
  const [currentStep, setCurrentStep] = useState<number>(step);
  const navigate = useNavigate();
  const [secData, setSecData] = useState<string[]>([]);

  const setData = (data: string[]): void => {
    setSecData(data);
  };

  const handleLogout = (): void => {
    Cookies.remove('authToken');
    navigate('/login');
  };

  const handleNext = (): void => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = (): void => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    if (currentStep === 2) {
      setFormData({ ...formData});
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      e.preventDefault();
      // const emptyFields: string[] = [];

      // Object.entries(formData).forEach(([key, value]) => {
      //   if (key === 'files') {
      //     return;
      //   }
      //   if (key === 'files2') {
      //     return;
      //   }
      //   if (value.length === 0) {
      //     emptyFields.push(key);
      //   } else if (key === 'address') {
      //     const addressKeys = Object.keys(formData.address);
      //     for (const addressKey of addressKeys) {
      //       if (!formData.address[addressKey]) {
      //         emptyFields.push(`address.${addressKey}`);
      //       }
      //     }
      //   }
      // });

      // if (emptyFields.length > 0) {
      //   alert('Please fill out all required fields before submitting.');
      //   console.log('Empty fields:', emptyFields);
      //   setCurrentStep(1);
      //   return;
      // }

      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        setCurrentStep(1);
        return;
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert('Please enter a valid 10-digit phone number.');
        setCurrentStep(1);
        return;
      }

      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(formData.address.pincode)) {
        alert('Please enter a valid 6-digit PIN code.');
        setCurrentStep(1);
        return;
      }

      if (formData.files2.length === 0) {
        alert('Please upload files.');
        setCurrentStep(1);
        return;
      }

      const formData2 = new FormData();
      for (const file of formData.files2) {
        formData2.append('files', file);
      }

      console.dir(formData.files);

      fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData2,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error('File upload failed:', error);
        });

      // const newFileNames = formData.files.map((file) => {
      //   return ({name : file.name});
      // });



      const newFileNames = formData.files2.map((file) => file.name);

      const updatedFormData: FormData = {
        ...formData,
        files: newFileNames,
      };

      const fileArray: File[] = Array.from(formData.files).map((fileName) => new File([fileName], fileName));

      fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error('Submission failed:', error);
        });

      setFormData({
        ...formData,
        name: '',
        email: '',
        phone: '',
        address: {
          al1: '',
          al2: '',
          city: '',
          state: '',
          pincode: '',
          country: '',
        },
        files: [],
        selectedOptions: [],
        geolocationStatus: 'None',
        submitDate: new Date(),
      });

      navigate('/submissions');
    }
  };

  const handleCancel = (): void => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: {
        al1: '',
        al2: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
      },
      files: [],
      files2:[],
      selectedOptions: [],
      geolocationStatus: 'None',
      submitDate: new Date(),
    });

    navigate('/submissions');
    setCurrentStep(1);
  };

  return (
    <div>
      {currentStep === 1 && (
        <BasicDetails
          handleNext={handleNext}
          handleCancel={handleCancel}
        />
      )}
      {currentStep === 2 && (
        <MultiFileUpload
          handleNext={handleNext}
          handleCancel={handleCancel}
          handlePrevious={handlePrevious}
        />
      )}
      {currentStep === 3 && (
        <MultiFieldSelect
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          handlePrevious={handlePrevious}
        />
      )}

      <div>
        <button
          onClick={handleLogout}
          className="fixed top-5 right-5 bg-red-500 text-white hover:bg-red-600 rounded-md p-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;