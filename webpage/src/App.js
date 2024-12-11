import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import SignupPage from './signup';
import Questionnaire from './questionnaire';
import LandingPage from './landingpage';
import ProfilePage from './profilepage';
import MatchPage from './matchpage';
import SelectedProfilePage from './SelectedProfilePage'; // New component for individual profiles
import './App.css';

function App() {
  const [personalityResult, setPersonalityResult] = useState({});
  const [userCluster, setUserCluster] = useState("");

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/questionnaire" element={<Questionnaire setPersonalityResult={setPersonalityResult} />} />
        <Route path="/profile" element={<ProfilePage personalityResult={personalityResult} setUserCluster={setUserCluster} />} />
        <Route path="/match" element={<MatchPage userCluster={userCluster} />} />
        <Route path="/profile/:name" element={<SelectedProfilePage />} /> {/* New route */}
      </Routes>
    </HashRouter>
  );
}

export default App;
