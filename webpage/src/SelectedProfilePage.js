import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./selectedprofilepage.css";
import arrows from "./images/matcharrows.png";

const SelectedProfilePage = () => {
    const { name } = useParams();
    const location = useLocation();
    const { userProfile, matchedProfile } = location.state || {};

    const [resolutionStrategy, setResolutionStrategy] = useState("");
    const [sentiment, setSentiment] = useState(null);

    useEffect(() => {
        // Fetch the sentiment-based resolution strategy
        fetch("http://localhost:5001/api/get-results")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch data");
                return res.json();
            })
            .then((data) => {
                console.log("Received data from backend:", data); // Debugging
                setResolutionStrategy(data.resolutionStrategy);
                setSentiment(data.sentiment);
            })
            .catch((error) => {
                console.error("Error fetching resolution strategy:", error);
            });
    }, []);

    return (
        <div className="selected-profile-container">
            <h1>Congratulations, you matched with {matchedProfile?.name || "someone"}!</h1>
            <div className="profiles-display">
                <div className="profile-section">
                    <h2>Your Information</h2>
                    <p><strong>Name:</strong> {userProfile?.name || "Your Name"}</p>
                    <p><strong>Bio:</strong> {userProfile?.bio || "Your Bio"}</p>
                    <p><strong>Interests:</strong> {userProfile?.interests?.join(", ") || "Your Interests"}</p>
                </div>
                <div className="arrow-container">
                    <img src={arrows} alt="Matching Arrow" className="arrow-image" />
                </div>
                <div className="profile-section">
                    <h2>{matchedProfile?.name}'s Information</h2>
                    <p><strong>Name:</strong> {matchedProfile?.name || "Their Name"}</p>
                    <p><strong>Bio:</strong> {matchedProfile?.bio || "Their Bio"}</p>
                    <p><strong>Interests:</strong> {matchedProfile?.interests?.join(", ") || "Their Interests"}</p>
                </div>
            </div>

            <div className="resolution-strategy">
                <h3>Recommended Conflict Resolution Strategy</h3>
                {sentiment ? (
                    <div>
                        <p><strong>Sentiment Score:</strong> {sentiment.compound.toFixed(2)}</p>
                        <p><strong>Strategy:</strong> {resolutionStrategy}</p>
                    </div>
                ) : (
                    <p>Loading resolution strategy...</p>
                )}
            </div>
        </div>
    );
};

export default SelectedProfilePage;