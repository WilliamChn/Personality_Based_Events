import React from "react";
import { useNavigate } from "react-router-dom";
import "./matchpage.css";

// Premade profiles
const profiles = [
    { id: 1, name: "Jeffrey", personality: "Grounded Visionary" },
    { id: 2, name: "Michael", personality: "Dynamic Dreamer" },
    { id: 3, name: "Ryan", personality: "Grounded Visionary" },
    { id: 4, name: "Andrea", personality: "Harmonious Explorer" },
    { id: 5, name: "Donna", personality: "Zen Socialite" },
    { id: 6, name: "Daniel", personality: "Grounded Visionary" },
    { id: 7, name: "Patricia", personality: "Zen Socialite" },
    { id: 8, name: "Debbie", personality: "Zen Socialite" },
    { id: 9, name: "Richard", personality: "Harmonious Explorer" },
    { id: 10, name: "Nathaniel", personality: "Harmonious Explorer" },
    { id: 11, name: "Randy", personality: "Zen Socialite" },
    { id: 12, name: "John", personality: "Grounded Visionary" },
    { id: 13, name: "Stephen", personality: "Grounded Visionary" },
    { id: 14, name: "Jennifer", personality: "Zen Socialite" },
    { id: 15, name: "Patrick", personality: "Grounded Visionary" },
    { id: 16, name: "Andrew", personality: "Chill Optimizer" },
    { id: 17, name: "Johnathan", personality: "Harmonious Explorer" },
    { id: 18, name: "Carrie", personality: "Dynamic Dreamer" },
    { id: 19, name: "Frank", personality: "Dynamic Dreamer" },
    { id: 20, name: "Victoria", personality: "Dynamic Dreamer" },
    { id: 21, name: "Taylor", personality: "Dynamic Dreamer" },
    { id: 22, name: "Daniel", personality: "Zen Socialite" },
    { id: 23, name: "Jacob", personality: "Chill Optimizer" },
    { id: 24, name: "Amanda", personality: "Dynamic Dreamer" },
    { id: 25, name: "Robert", personality: "Zen Socialite" },
    { id: 26, name: "Elizabeth", personality: "Harmonious Explorer" },
    { id: 27, name: "Joshua", personality: "Zen Socialite" },
    { id: 28, name: "Mary", personality: "Dynamic Dreamer" },
    { id: 29, name: "Joseph", personality: "Zen Socialite" },
    { id: 30, name: "Julia", personality: "Chill Optimizer" },
    { id: 31, name: "Denise", personality: "Dynamic Dreamer" },
    { id: 32, name: "Victoria", personality: "Zen Socialite" },
    { id: 33, name: "Megan", personality: "Grounded Visionary" },
    { id: 34, name: "Emily", personality: "Harmonious Explorer" },
    { id: 35, name: "Christopher", personality: "Harmonious Explorer" },
    { id: 36, name: "Shari", personality: "Chill Optimizer" },
    { id: 37, name: "Loretta", personality: "Harmonious Explorer" },
    { id: 38, name: "Jason", personality: "Grounded Visionary" },
    { id: 39, name: "Robert", personality: "Chill Optimizer" },
    { id: 40, name: "Cody", personality: "Harmonious Explorer" },
    { id: 41, name: "Jonathan", personality: "Chill Optimizer" },
    { id: 42, name: "Tyrone", personality: "Grounded Visionary" },
    { id: 43, name: "Evan", personality: "Chill Optimizer" },
    { id: 44, name: "John", personality: "Dynamic Dreamer" },
    { id: 45, name: "Craig", personality: "Dynamic Dreamer" },
    { id: 46, name: "Anne", personality: "Chill Optimizer" },
    { id: 47, name: "Colleen", personality: "Zen Socialite" },
    { id: 48, name: "Dwayne", personality: "Grounded Visionary" },
    { id: 49, name: "Paige", personality: "Harmonious Explorer" },
    { id: 50, name: "Matthew", personality: "Dynamic Dreamer" },
    { id: 51, name: "Jennifer", personality: "Dynamic Dreamer" },
    { id: 52, name: "Michelle", personality: "Zen Socialite" },
    { id: 53, name: "George", personality: "Grounded Visionary" },
    { id: 54, name: "David", personality: "Chill Optimizer" },
    { id: 55, name: "Sean", personality: "Chill Optimizer" },
    { id: 56, name: "Sydney", personality: "Dynamic Dreamer" },
    { id: 57, name: "Mary", personality: "Dynamic Dreamer" },
    { id: 58, name: "Paul", personality: "Zen Socialite" },
    { id: 59, name: "Paul", personality: "Dynamic Dreamer" },
    { id: 60, name: "Robyn", personality: "Grounded Visionary" },
    { id: 61, name: "Rachel", personality: "Grounded Visionary" },
    { id: 62, name: "Scott", personality: "Chill Optimizer" },
    { id: 63, name: "Eric", personality: "Grounded Visionary" },
    { id: 64, name: "Clinton", personality: "Zen Socialite" },
    { id: 65, name: "Stacey", personality: "Grounded Visionary" },
    { id: 66, name: "Larry", personality: "Dynamic Dreamer" },
    { id: 67, name: "John", personality: "Harmonious Explorer" },
    { id: 68, name: "Robert", personality: "Zen Socialite" },
    { id: 69, name: "Mckenzie", personality: "Harmonious Explorer" },
    { id: 70, name: "Danielle", personality: "Chill Optimizer" },
    { id: 71, name: "Laura", personality: "Harmonious Explorer" },
    { id: 72, name: "Brandy", personality: "Harmonious Explorer" },
    { id: 73, name: "Joseph", personality: "Grounded Visionary" },
    { id: 74, name: "Aaron", personality: "Chill Optimizer" },
    { id: 75, name: "Jill", personality: "Grounded Visionary" },
    { id: 76, name: "Gail", personality: "Zen Socialite" },
    { id: 77, name: "Veronica", personality: "Harmonious Explorer" },
    { id: 78, name: "Rebecca", personality: "Chill Optimizer" },
    { id: 79, name: "Douglas", personality: "Chill Optimizer" },
    { id: 80, name: "April", personality: "Chill Optimizer" },
    { id: 81, name: "Justin", personality: "Zen Socialite" },
    { id: 82, name: "Natalie", personality: "Harmonious Explorer" },
    { id: 83, name: "Michelle", personality: "Zen Socialite" },
    { id: 84, name: "Mary", personality: "Harmonious Explorer" },
    { id: 85, name: "Allison", personality: "Dynamic Dreamer" },
    { id: 86, name: "Charles", personality: "Dynamic Dreamer" },
    { id: 87, name: "Christopher", personality: "Chill Optimizer" },
    { id: 88, name: "Sandra", personality: "Zen Socialite" },
    { id: 89, name: "Ashley", personality: "Grounded Visionary" },
    { id: 90, name: "Cristina", personality: "Chill Optimizer" },
    { id: 91, name: "David", personality: "Grounded Visionary" },
    { id: 92, name: "Elizabeth", personality: "Harmonious Explorer" },
    { id: 93, name: "Richard", personality: "Chill Optimizer" },
    { id: 94, name: "Justin", personality: "Harmonious Explorer" },
    { id: 95, name: "Christopher", personality: "Dynamic Dreamer" },
    { id: 96, name: "Sarah", personality: "Chill Optimizer" },
    { id: 97, name: "Megan", personality: "Dynamic Dreamer" },
    { id: 98, name: "Austin", personality: "Grounded Visionary" },
    { id: 99, name: "Darius", personality: "Zen Socialite" },
    { id: 100, name: "James", personality: "Harmonious Explorer" },
    
];

const MatchPage = ({ userCluster }) => {
    const navigate = useNavigate();
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
              style={{ cursor: "pointer" }}
            >
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
