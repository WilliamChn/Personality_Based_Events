import React from "react";
import { useParams, useLocation } from "react-router-dom";
import "./selectedprofilepage.css";
import arrows from "./images/matcharrows.png";

const SelectedProfilePage = () => {
  const { name } = useParams(); // Retrieve the selected profile's name from the URL
  const location = useLocation();
  const { userProfile, matchedProfile } = location.state || {};
  console.log("Location State in SelectedProfilePage:", location.state);

  return (
    <div className="selected-profile-container">
      <h1>Congratulations, you matched with {matchedProfile?.name || "someone"}!</h1>
      <div className="profiles-display">
        {/* User Information */}
        <div className="profile-section">
          <h2>Your Information</h2>
          <p><strong>Name:</strong> {userProfile?.name || "Your Name"}</p>
          <p><strong>Bio:</strong> {userProfile?.bio || "Your Bio"}</p>
          <p><strong>Interests:</strong> {userProfile?.interests?.join(", ") || "Your Interests"}</p>
        </div>

        {/* Matching Arrow */}
        <div className="arrow-container">
          <img src={arrows} alt="Matching Arrow" className="arrow-image" />
        </div>

        {/* Selected Profile Information */}
        <div className="profile-section">
          <h2>{matchedProfile?.name}'s Information</h2>
          <p><strong>Name:</strong> {matchedProfile?.name || "Their Name"}</p>
          <p><strong>Bio:</strong> {matchedProfile?.bio || "Their Bio"}</p>
          <p><strong>Interests:</strong> {matchedProfile?.interests?.join(", ") || "Their Interests"}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectedProfilePage;
