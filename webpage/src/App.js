import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import SignupPage from './signup';
import Questionnaire from './questionnaire';
import LandingPage from './landingpage';
import ProfilePage from './profilepage';
import './App.css';

function App() {
  const [personalityResult, setPersonalityResult] = useState({});
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/questionnaire" element={<Questionnaire setPersonalityResult={setPersonalityResult} />} />
        <Route path="/profile" element={<ProfilePage personalityResult={personalityResult} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
