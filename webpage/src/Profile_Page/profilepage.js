import React, { useState, useEffect } from "react";
import vader from "vader-sentiment"; // Import VADER for sentiment analysis
import { supabase } from "../supabase"; // Import Supabase client
import "./profilepage.css";
import optimizer from "../images/chill_optimizer.webp";
import dreamer from "../images/dynamic_dreamer.webp";
import visionary from "../images/grounded_visionary.png";
import explorer from "../images/harmonious_explorer.webp";
import socialite from "../images/zen_socialite.webp";
import axios from "axios"; // Import Axios for fetching events

const ProfilePage = ({ setUserCluster }) => {
    const [personalityData, setPersonalityData] = useState(null);
    const [openEndedResponse, setOpenEndedResponse] = useState("");
    const [sentimentScores, setSentimentScores] = useState(null);
    const [resolutionStrategy, setResolutionStrategy] = useState("");
    const [events, setEvents] = useState([]); // State for fetched events
    const [city, setCity] = useState(""); // State for user's city
    const API_KEY = process.env.REACT_APP_TICKETMASTER_API_KEY; // Ticketmaster API Key

    const personalityClusters = {
        "Zen Socialite": {
            image: socialite,
            traits: "Balanced, friendly, organized, moderately open.",
            description: "These individuals value organization and enjoy socializing in moderation.",
        },
        "Chill Optimizer": {
            image: optimizer,
            traits: "Practical, slightly outgoing, kind but independent, detail-oriented.",
            description: "A mix of practicality and openness, these individuals seek meaningful connections but value their alone time.",
        },
        "Dynamic Dreamer": {
            image: dreamer,
            traits: "Energetic, resilient, empathetic, reliable, imaginative.",
            description: "The life of the party and the dreamer of the group, these individuals bring energy and imagination.",
        },
        "Grounded Visionary": {
            image: visionary,
            traits: "Calm, easygoing, methodical, moderately creative.",
            description: "Quiet but curious, these individuals value structure but have an artistic streak.",
        },
        "Harmonious Explorer": {
            image: explorer,
            traits: "Outgoing, emotionally stable, highly cooperative, meticulous, adventurous.",
            description: "Extroverted, emotionally stable, and team-oriented, they're the ultimate travel buddy and debate mediator.",
        },
    };

    const determineCluster = (result) => {
        if (!result) return "Zen Socialite"; // Default fallback

        const clusterValues = {
            "Zen Socialite": { extraversion: 2.95, emotional_stability: 2.99, agreeableness: 3.0, conscientiousness: 2.91, openness: 2.85 },
            "Chill Optimizer": { extraversion: 3.09, emotional_stability: 2.48, agreeableness: 3.2, conscientiousness: 3.19, openness: 3.31 },
            "Dynamic Dreamer": { extraversion: 3.6, emotional_stability: 3.31, agreeableness: 3.3, conscientiousness: 3.18, openness: 3.37 },
            "Grounded Visionary": { extraversion: 2.97, emotional_stability: 2.77, agreeableness: 2.92, conscientiousness: 3.1, openness: 3.4 },
            "Harmonious Explorer": { extraversion: 3.0, emotional_stability: 3.55, agreeableness: 3.22, conscientiousness: 3.23, openness: 3.33 },
        };

        const distances = Object.entries(clusterValues).map(([cluster, values]) => {
            const distance = Math.sqrt(
                Object.keys(values).reduce((sum, key) => {
                    const diff = result[key] - values[key];
                    return sum + diff * diff;
                }, 0)
            );
            return { cluster, distance };
        });

        const closestCluster = distances.reduce((prev, curr) =>
            prev.distance < curr.distance ? prev : curr
        );

        return closestCluster.cluster;
    };

    const calculateSentiment = (response) => {
        const sentimentScores = vader.SentimentIntensityAnalyzer.polarity_scores(response || "");
        setSentimentScores(sentimentScores);

        let strategy = "Maintain consistent and clear communication.";
        if (sentimentScores.compound > 0.8) {
            strategy = "Your positive energy is contagious! Focus on building meaningful connections.";
        } else if (sentimentScores.compound > 0.5) {
            strategy = "You have a positive outlook! Maintain collaboration.";
        } else if (sentimentScores.compound > 0.3) {
            strategy = "Encourage open communication while identifying collaboration opportunities.";
        } else if (sentimentScores.compound >= -0.3) {
            strategy = "Set clear expectations and maintain respectful communication.";
        } else {
            strategy = "Significant challenges. Prioritize addressing key issues directly.";
        }

        setResolutionStrategy(strategy);
    };

    useEffect(() => {
        const fetchPersonalityData = async () => {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError) {
                    console.error("Error fetching authenticated user:", userError.message);
                    return;
                }

                if (!user || !user.id) {
                    console.error("No authenticated user found or user ID is missing.");
                    return;
                }

                const { data, error } = await supabase
                    .from("user_personality_data")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching personality data:", error.message);
                    return;
                }

                setPersonalityData(data);
                setOpenEndedResponse(data.open_ended || "");
                calculateSentiment(data.open_ended);

                // Fetch user city from user_data table
                const { data: cityData, error: cityError } = await supabase
                    .from("user_data")
                    .select("city")
                    .eq("id", user.id)
                    .single();

                if (cityError) {
                    console.error("Error fetching user city:", cityError.message);
                } else {
                    setCity(cityData?.city || "");
                }
            } catch (error) {
                console.error("Unexpected error fetching personality data:", error.message);
            }
        };

        fetchPersonalityData();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!city || !personalityData) return;

            const cluster = determineCluster(personalityData);
            const keywords = personalityClusters[cluster]?.keywords;

            if (!keywords) return;

            try {
                const response = await axios.get(
                    "https://app.ticketmaster.com/discovery/v2/events.json",
                    {
                        params: {
                            apikey: API_KEY,
                            keyword: keywords,
                            city,
                            startDateTime: "2024-01-01T00:00:00Z",
                            endDateTime: "2025-12-31T23:59:59Z",
                            radius: 10,
                            unit: "miles",
                        },
                    }
                );

                if (response.data._embedded?.events) {
                    setEvents(response.data._embedded.events);
                } else {
                    console.log("No events found for the given criteria.");
                }
            } catch (error) {
                console.error("Error fetching events:", error.response?.status || error.message);
            }
        };

        fetchEvents();
    }, [city, personalityData]);

    const cluster = personalityData ? determineCluster(personalityData) : null;
    const clusterDetails = personalityClusters[cluster];

    if (!personalityData || !clusterDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="leftside">
                <h1>Your Personality Cluster: {cluster}</h1>
                <img src={clusterDetails.image} alt="Personality" />
                <h3>Open-Ended Response:</h3>
                <p>{openEndedResponse}</p>
                <h3>Sentiment Analysis:</h3>
                <p>Compound Score: {sentimentScores?.compound.toFixed(2)}</p>
                <p>Resolution Strategy: {resolutionStrategy}</p>
            </div>
            <div className="rightside">
                <h3>Key Traits</h3>
                <p>{clusterDetails.traits}</p>
                <h3>Description</h3>
                <p>{clusterDetails.description}</p>
                <h3>Upcoming Events in {city}</h3>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>
                                <strong>{event.name}</strong> <br />
                                {event.dates.start.localDate} <br />
                                {event._embedded.venues[0].name} - {event._embedded.venues[0].city.name} <br />
                                <a href={event.url} target="_blank" rel="noopener noreferrer">
                                    More Details
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events available.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
