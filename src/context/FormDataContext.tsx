import React, { createContext, useContext, useState, FC } from 'react';

interface FormData {
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
  selectedOptions: string[];
  geolocationStatus: string;
  files: string[];
  files2: File[];
  submitDate: Date;
}

interface FormDataContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: () => void;
}

const FormDataContext = createContext<FormDataContextProps | undefined>(undefined);

export const useFormData = (): FormDataContextProps => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};

interface FormDataProviderProps {
  children: React.ReactNode;
}

const FormDataProvider: FC<FormDataProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
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
    selectedOptions: [],
    geolocationStatus: 'No Data',
    files: [],
    files2:[],
    submitDate: new Date(),
  });

  const handleSubmit = () => {
    const updatedFormData: FormData = {
      ...formData,
      submitDate: new Date(),
    };
    setFormData(updatedFormData);
  };

  return (
    <FormDataContext.Provider value={{ formData, setFormData, handleSubmit }}>
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataProvider;
