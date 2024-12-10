import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import SignupPage from './signup';
import Questionnaire from './questionnaire';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
