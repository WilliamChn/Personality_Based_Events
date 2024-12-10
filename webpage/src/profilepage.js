import React from "react";
import "./profilepage.css";

const ProfilePage = ({ personalityResult }) => {
    const personalityClusters = {
        "Zen Socialite": {
            traits: "Balanced, friendly, organized, moderately open.",
            description:
                "These individuals value organization and enjoy socializing in moderation. They're great at finding balance in relationships and responsibilities.",
            strategy: [
                "Collaborative Scheduling: Encourage shared schedules for cleaning, quiet hours, and social events.",
                "Clear Boundaries for Social Time: Set agreed times for hosting guests or group activities.",
            ],
        },
        "Chill Optimizer": {
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
            traits: "Energetic, resilient, empathetic, reliable, imaginative.",
            description:
                "The life of the party and the dreamer of the group, these individuals bring energy and imagination. They're the ones who suggest wild ideas and actually follow through.",
            strategy: [
                "Empathy-Driven Dialogue: Engage in conversations that validate feelings and encourage understanding.",
                "Encourage Creativity in Solutions: Brainstorm creative ways to address conflicts, such as themed events or unconventional approaches.",
            ],
        },
        "Grounded Visionary": {
            traits: "Calm, easygoing, methodical, moderately creative.",
            description:
                "Quiet but curious, these individuals value structure but have an artistic streak. They’re the roommate who keeps things grounded while doodling masterpieces.",
            strategy: [
                "Structured Problem-Solving: Break down conflicts into manageable steps.",
                "Focus on Practical Outcomes: Stick to actionable resolutions rather than emotional debates.",
            ],
        },
        "Harmonious Explorer": {
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

    // Determine cluster based on personality trait averages
    const determineCluster = (result) => {
        if (!result) return "Zen Socialite"; // Default fallback

        const {
            Extraversion,
            "Emotional Stability": EmotionalStability,
            Agreeableness,
            Conscientiousness,
            Openness,
        } = result;

        // Example logic to determine the cluster (adjust as necessary)
        if (Extraversion > 3 && Openness > 3.3) return "Harmonious Explorer";
        if (Extraversion > 3) return "Dynamic Dreamer";
        if (Conscientiousness > 3 && EmotionalStability > 3) return "Zen Socialite";
        if (Conscientiousness > 3 && Agreeableness > 3) return "Chill Optimizer";
        return "Grounded Visionary";
    };

    const cluster = determineCluster(personalityResult);
    const clusterDetails = personalityClusters[cluster];

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
        </div>
    );
};

export default ProfilePage;
