import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landingpage.css';

const LandingPage = () => {

    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate("/signup");
    };

    return (
        <div className="landing-container">
            <h1 className="landing-title">Roommate Matcher</h1>
            <button className="landing-button" onClick={handleButtonClick}>
                Click here to find your match!
            </button>
        </div>
    );
};

export default LandingPage;
