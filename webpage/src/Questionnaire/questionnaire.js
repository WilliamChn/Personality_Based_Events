import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./questionnaire.css";
import { supabase } from "../supabase"; 

const Questionnaire = ({ setPersonalityResult }) => {
    const [responses, setResponses] = useState({});
    const navigate = useNavigate();

    const questions = {
        Extraversion: [
            "I enjoy meeting new people and building connections.",
            "I feel energized after spending time with groups of people.",
            "I am comfortable initiating conversations with others.",
        ],
        "Emotional Stability": [
            "I remain calm and composed under stressful situations.",
            "I rarely feel overwhelmed by unexpected challenges.",
            "I am good at managing my emotions when things don't go as planned.",
        ],
        Agreeableness: [
            "I find it easy to get along with people who have different opinions.",
            "I enjoy helping others and making them feel comfortable.",
            "I try to avoid arguments and disagreements.",
        ],
        Conscientiousness: [
            "I am very organized in my daily activities and tasks.",
            "I always meet deadlines for tasks or assignments.",
            "I pay close attention to detail in my work.",
        ],
        Openness: [
            "I enjoy trying new activities or exploring unfamiliar topics.",
            "I like to think about abstract or complex ideas.",
            "I am open to learning and experiencing new cultures or lifestyles.",
        ],
    };

    const handleSelect = (trait, questionIndex, value) => {
        setResponses((prev) => {
            const updated = { ...prev, [`${trait}-${questionIndex}`]: parseInt(value) };
            console.log("Updated responses:", updated);
            return updated;
        });
    };

    const calculateResults = async () => {
        const results = {};
        for (let trait in questions) {
            const traitResponses = Object.keys(responses)
                .filter((key) => key.startsWith(trait))
                .map((key) => responses[key]);
    
            const average =
                traitResponses.reduce((sum, val) => sum + val, 0) / questions[trait].length;
    
            results[trait] = average;
        }
        results.openEnded = responses.openEnded; // Include open-ended response
    
        console.log("Final Results:", results);
    
        // Get the currently authenticated user's ID
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
    
        if (userError || !user) {
            console.error("Error fetching user:", userError.message);
            return;
        }
    
        const userId = user.id;
    
        // Insert data into the user_personality_data table
        try {
            const { error: insertError } = await supabase.from("user_personality_data").insert([
                {
                    id: userId,
                    extraversion: results.Extraversion,
                    emotional_stability: results["Emotional Stability"],
                    agreeableness: results.Agreeableness,
                    conscientiousness: results.Conscientiousness,
                    openness: results.Openness,
                    open_ended: results.openEnded,
                },
            ]);
    
            if (insertError) {
                throw insertError;
            }
    
            console.log("Results saved to database successfully!");
        } catch (error) {
            console.error("Error saving results to database:", error.message);
        }
    
        navigate("/profile"); // Redirect to profile page
    };

    return (
        <div className="questionnaire-container">
            <h1>Questionnaire</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    calculateResults();
                }}
                className="questionnaire-form">
                {Object.keys(questions).map((trait) => (
                    <div key={trait} className="trait-section">
                        <h3>{trait}</h3>
                        {questions[trait].map((question, index) => (
                            <div key={index} className="form-group">
                                <label>{question}</label>
                                <div className="rating-boxes">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            type="button"
                                            key={value}
                                            className={`rating-box ${
                                                responses[`${trait}-${index}`] === value
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => handleSelect(trait, index, value)}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <hr class="solid"></hr>
                <div className="form-group">
                    <label>Tell us about your ideal roommate or living preferences:</label>
                    <textarea
                        placeholder="Write your response here..."
                        className="feedback-input"
                        onChange={(e) =>
                            setResponses((prev) => ({ ...prev, openEnded: e.target.value }))
                        }
                    />
                </div>
                <button type="submit" className="questionnaire-submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Questionnaire;