import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profilepage.css";
import optimizer from "../images/chill_optimizer.webp";
import dreamer from "../images/dynamic_dreamer.webp";
import visionary from "../images/grounded_visionary.png";
import explorer from "../images/harmonious_explorer.webp";
import socialite from "../images/zen_socialite.webp";
import { supabase } from "../supabase"; // Import Supabase client

const ProfilePage = ({ personalityResult, setUserCluster }) => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [city, setCity] = useState(""); // Store the user's city
    const API_KEY = process.env.REACT_APP_TICKETMASTER_API_KEY; // Fetch API key from .env

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
            keywords: "Sports",
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
            keywords: "Sports",
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
            keywords: "Sports",
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
            keywords: "Sports",
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
            keywords: "Sports",
        },
    };

    const determineCluster = (result) => {
        if (!result) return "Zen Socialite"; // Default fallback

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

    const cluster = determineCluster(personalityResult);
    const clusterDetails = personalityClusters[cluster];

    useEffect(() => {
        const fetchUserCity = async () => {
            try {
                // Get the authenticated user's details
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError) {
                    console.error("Error fetching user:", userError.message);
                    return;
                }

                const userId = user?.id;

                if (!userId) {
                    console.error("No user ID found.");
                    return;
                }

                // Query the `user_data` table to get the city
                const { data, error: cityError } = await supabase
                    .from("user_data")
                    .select("city")
                    .eq("id", userId)
                    .single();

                if (cityError) {
                    console.error("Error fetching user city:", cityError.message);
                    return;
                }

                setCity(data?.city || ""); // Set city or fallback to an empty string
            } catch (error) {
                console.error("Error during city fetch:", error.message);
            }
        };

        fetchUserCity();
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
        console.log("City:", city);
        console.log("Cluster Keywords:", clusterDetails?.keywords);
        if (!city || !clusterDetails?.keywords) {
            console.log("City or keywords not available. Skipping fetch.");
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    "https://app.ticketmaster.com/discovery/v2/events.json",
                    {
                        params: {
                            apikey: API_KEY,
                            keyword: clusterDetails.keywords, // Use the keyword from personality cluster
                            postalCode: "11378", // Use the user's city
                            startDateTime: "2024-01-01T00:00:00Z",
                            endDateTime: "2025-12-31T23:59:59Z",
                            radius: 10,
                            unit: "miles", 
                        },
                    }
                );

                if (response.data._embedded && response.data._embedded.events) {
                    setEvents(response.data._embedded.events);
                    console.log("Fetched events:", response.data._embedded.events);
                } else {
                    console.log("No events found for the given criteria.");
                }
            } catch (error) {
                console.error("Error fetching events:", error.response?.status || error.message);
            }
        };

        fetchEvents();
    }, [city, clusterDetails.keywords]); // Trigger only when `city` or `keywords` change

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
            <div className="leftside">
                <h1>Your Personality Cluster: {cluster}</h1>
                <img src={clusterDetails.image} alt="Personality" />
            </div>
            <div className="rightside">
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
            <div className="events-section">
                <h3>Upcoming Events in {city}</h3>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event, index) => (
                            <li key={index}>
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
