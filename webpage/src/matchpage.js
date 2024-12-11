import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./matchpage.css";

// Premade profiles with bios and interests
const profiles = [
    { id: 1, name: "Jeffrey", personality: "Grounded Visionary", bio: "Enjoys hiking and photography.", interests: ["Nature", "Art", "Fitness"] },
    { id: 2, name: "Michael", personality: "Dynamic Dreamer", bio: "Loves coding and gaming.", interests: ["Technology", "Gaming", "Music"] },
    { id: 3, name: "Ryan", personality: "Grounded Visionary", bio: "Passionate about community service.", interests: ["Volunteering", "Gardening", "Cooking"] },
    { id: 4, name: "Andrea", personality: "Harmonious Explorer", bio: "Travel enthusiast and book lover.", interests: ["Travel", "Books", "History"] },
    // Add more profiles...
];

const MatchPage = ({ userCluster }) => {
    const navigate = useNavigate();
    const [hoveredProfile, setHoveredProfile] = useState(null);

    const filteredProfiles = profiles.filter(profile => profile.personality === userCluster);

    return (
        <div className="match-container">
            <h1>Find Your Match</h1>
            <p>Your Cluster: <strong>{userCluster}</strong></p>
            <div className="profiles-container">
                {filteredProfiles.map(profile => (
                    <div
                        key={profile.id}
                        className="profile-card"
                        onClick={() => navigate(`/profile/${profile.name}`)} // Navigate to the profile's page
                        onMouseEnter={() => setHoveredProfile(profile)} // Set hovered profile
                        onMouseLeave={() => setHoveredProfile(null)} // Clear hovered profile
                        style={{ cursor: "pointer" }}
                    >
                        <h3>{profile.name}</h3>
                        <p>{profile.personality}</p>
                        {hoveredProfile === profile && (
                            <div className="hover-card">
                                <p><strong>Bio:</strong> {profile.bio}</p>
                                <p><strong>Interests:</strong> {profile.interests.join(", ")}</p>
                            </div>
                        )}
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
