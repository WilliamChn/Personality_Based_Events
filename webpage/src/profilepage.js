import React from "react";
import { useNavigate } from "react-router-dom";
import "./profilepage.css";
import optimizer from "./images/chill_optimizer.webp";
import dreamer from "./images/dynamic_dreamer.webp";
import visionary from "./images/grounded_visionary.png";
import explorer from "./images/harmonious_explorer.webp";
import socialite from "./images/zen_socialite.webp";

const ProfilePage = ({ personalityResult, setUserCluster }) => {
    const navigate = useNavigate();
    const personalityClusters = {
        "Zen Socialite": {
            image: socialite,
            traits: "Balanced, friendly, organized, moderately open.",
            description:
                "These individuals value organization and enjoy socializing in moderation. They're great at finding balance in relationships and responsibilities.",
            strategy: [
                "Collaborative Scheduling: Encourage shared schedules for cleaning, quiet hours, and social events.",
                "Clear Boundaries for Social Time: Set agreed times for hosting guests or group activities.",
            ],
        },
        "Chill Optimizer": {
            image: optimizer,
            traits:
                "Practical, slightly outgoing, kind but independent, detail-oriented.",
            description:
                "A mix of practicality and openness, these individuals seek meaningful connections but value their alone time.",
            strategy: [
                "Direct, Clear Communication: Approach conflicts with actionable steps.",
                "Respect Alone Time: Value their independence and personal space.",
            ],
        },
        "Dynamic Dreamer": {
            image: dreamer,
            traits: "Energetic, resilient, empathetic, reliable, imaginative.",
            description:
                "The life of the party and the dreamer of the group, these individuals bring energy and imagination. They're the ones who suggest wild ideas and actually follow through.",
            strategy: [
                "Empathy-Driven Dialogue: Engage in conversations that validate feelings and encourage understanding.",
                "Encourage Creativity in Solutions: Brainstorm creative ways to address conflicts, such as themed events or unconventional approaches.",
            ],
        },
        "Grounded Visionary": {
            image: visionary,
            traits: "Calm, easygoing, methodical, moderately creative.",
            description:
                "Quiet but curious, these individuals value structure but have an artistic streak. They’re the roommate who keeps things grounded while doodling masterpieces.",
            strategy: [
                "Structured Problem-Solving: Break down conflicts into manageable steps.",
                "Focus on Practical Outcomes: Stick to actionable resolutions rather than emotional debates.",
            ],
        },
        "Harmonious Explorer": {
            image: explorer,
            traits:
                "Outgoing, emotionally stable, highly cooperative, meticulous, adventurous.",
            description:
                "Extroverted, emotionally stable, and team-oriented, they're the ultimate travel buddy and debate mediator rolled into one.",
            strategy: [
                "Teamwork and Compromise: Create win-win situations where everyone feels heard and satisfied.",
                "Adventurous Problem-Solving: Suggest trying something new to ease tension, like group outings or shared activities.",
            ],
        },
    };

const determineCluster = (result) => {
    if (!result) return "Zen Socialite"; // Default fallback

    // Predefined cluster values
    const clusterValues = {
        "Zen Socialite": {
            Extraversion: 2.95,
            "Emotional Stability": 2.99,
            Agreeableness: 3.00,
            Conscientiousness: 2.91,
            Openness: 2.85,
        },
        "Chill Optimizer": {
            Extraversion: 3.09,
            "Emotional Stability": 2.48,
            Agreeableness: 3.20,
            Conscientiousness: 3.19,
            Openness: 3.31,
        },
        "Dynamic Dreamer": {
            Extraversion: 3.60,
            "Emotional Stability": 3.31,
            Agreeableness: 3.30,
            Conscientiousness: 3.18,
            Openness: 3.37,
        },
        "Grounded Visionary": {
            Extraversion: 2.97,
            "Emotional Stability": 2.77,
            Agreeableness: 2.92,
            Conscientiousness: 3.10,
            Openness: 3.40,
        },
        "Harmonious Explorer": {
            Extraversion: 3.00,
            "Emotional Stability": 3.55,
            Agreeableness: 3.22,
            Conscientiousness: 3.23,
            Openness: 3.33,
        },
    };

    // Calculate Euclidean distance for each cluster
    const distances = Object.entries(clusterValues).map(([cluster, values]) => {
        const distance = Math.sqrt(
            Object.keys(values).reduce((sum, key) => {
                const diff = result[key] - values[key];
                return sum + diff * diff;
            }, 0)
        );
        return { cluster, distance };
    });

    // Log the distances for debugging
    console.log("Distances to each cluster:", distances);

    // Find the cluster with the smallest distance
    const closestCluster = distances.reduce((prev, curr) =>
        prev.distance < curr.distance ? prev : curr
    );

    console.log("Closest cluster:", closestCluster.cluster);
    return closestCluster.cluster;
};



    const cluster = determineCluster(personalityResult);
    const clusterDetails = personalityClusters[cluster];

    // Pass cluster to App.js and navigate to MatchPage
    const handleFindMatchClick = () => {
        setUserCluster(cluster);
        navigate("/match");
    };

    if (!clusterDetails) {
        return (
            <div className="profile-container">
                <h1>Error</h1>
                <p>Personality cluster data is missing. Please retake the questionnaire.</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h1>Your Personality Cluster: {cluster}</h1>
            <img src={clusterDetails.image} alt="Personality" />
            <h3>Key Traits</h3>
            <p>{clusterDetails.traits}</p>
            <h3>Description</h3>
            <p>{clusterDetails.description}</p>
            <h3>Conflict Resolution Strategies</h3>
            <ul>
                {clusterDetails.strategy.map((s, index) => (
                    <li key={index}>{s}</li>
                ))}
            </ul>
            <button className="find-match-button" onClick={handleFindMatchClick}>
                Find your match!
            </button>
        </div>
    );
};

export default ProfilePage;