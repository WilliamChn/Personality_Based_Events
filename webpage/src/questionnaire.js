import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./questionnaire.css";

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
                traitResponses.reduce((sum, val) => sum + val, 0) /
                questions[trait].length;

            results[trait] = average;
        }
        setPersonalityResult(results);

        // Send results to backend
        try {
            const res = await fetch("http://localhost:5001/api/save-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(results),
            });

            if (res.ok) {
                console.log("Results saved to CSV successfully!");
            } else {
                console.error("Failed to save results to backend.");
            }
        } catch (error) {
            console.error("Error saving results:", error);
        }

        navigate("/profile");
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
                <button type="submit" className="questionnaire-submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Questionnaire;