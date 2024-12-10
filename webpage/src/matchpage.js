import React from "react";
import "./matchpage.css";

// Premade profiles
const profiles = [
    { id: 1, name: "Alice", personality: "Zen Socialite" },
    { id: 2, name: "Bob", personality: "Chill Optimizer" },
    { id: 3, name: "Charlie", personality: "Dynamic Dreamer" },
    { id: 4, name: "Diana", personality: "Grounded Visionary" },
    { id: 5, name: "Edward", personality: "Harmonious Explorer" },
    { id: 6, name: "Fiona", personality: "Dynamic Dreamer" },
    { id: 7, name: "George", personality: "Chill Optimizer" },
    { id: 8, name: "Hannah", personality: "Zen Socialite" },
    { id: 9, name: "Isabel", personality: "Grounded Visionary" },
    { id: 10, name: "Jack", personality: "Harmonious Explorer" },
];

const MatchPage = ({ userCluster }) => {
    const filteredProfiles = profiles.filter(profile => profile.personality === userCluster);

    return (
        <div className="match-container">
            <h1>Find Your Match</h1>
            <p>Your Cluster: <strong>{userCluster}</strong></p>
            <div className="profiles-container">
                {filteredProfiles.map(profile => (
                    <div key={profile.id} className="profile-card">
                        <h3>{profile.name}</h3>
                        <p>{profile.personality}</p>
                    </div>
                ))}
                {filteredProfiles.length === 0 && (
                    <p>No matches available for your cluster at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default MatchPage;
