// @ts-nocheck

import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import MultiStepForm from './components/MultiStepForm';
import SubmissionTable from './components/SubmissionTable';
import  FormDataProvider  from './context/FormDataContext';

const App: FC = () => {
  return (
    <BrowserRouter>
      <FormDataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/form" element={<MultiStepForm step={1} />}/>
            <Route  path="/submissions" element={<SubmissionTable/>}/>
          </Routes>
      </FormDataProvider>
    </BrowserRouter>
  );
}

export default App;