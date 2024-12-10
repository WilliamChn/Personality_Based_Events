import React, { useState } from 'react';
import './questionnaire.css';

const Questionnaire = () => {
    const [responses, setResponses] = useState({});

    const questions = [
        {
            category: "Extraversion", questions: [
                "I enjoy meeting new people and building connections.",
                "I feel energized after spending time with groups of people.",
                "I am comfortable initiating conversations with others."
            ]
        },
        {
            category: "Emotional Stability", questions: [
                "I remain calm and composed under stressful situations.",
                "I rarely feel overwhelmed by unexpected challenges.",
                "I am good at managing my emotions when things don't go as planned."
            ]
        },
        {
            category: "Agreeableness", questions: [
                "I find it easy to get along with people who have different opinions.",
                "I enjoy helping others and making them feel comfortable.",
                "I try to avoid arguments and disagreements."
            ]
        },
        {
            category: "Conscientiousness", questions: [
                "I am very organized in my daily activities and tasks.",
                "I always meet deadlines for tasks or assignments.",
                "I pay close attention to detail in my work."
            ]
        },
        {
            category: "Openness to Experience", questions: [
                "I enjoy trying new activities or exploring unfamiliar topics.",
                "I like to think about abstract or complex ideas.",
                "I am open to learning and experiencing new cultures or lifestyles."
            ]
        }
    ];

    const handleClick = (category, index, value) => {
        setResponses({
            ...responses,
            [`${category}-${index}`]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User Responses:", responses);
        alert("Questionnaire submitted successfully!");
    };

    return (
        <div className="questionnaire-container">
            <div className="questionnaire-header">
                <h2>Hello User.</h2>
                <p>Please fill out this survey. Please select answers for each question with 1 being very inaccurate and 5 being very accurate.</p>
            </div>
            <form onSubmit={handleSubmit} className="questionnaire-form">
                {questions.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="question-category">
                        <h3>{section.category}</h3>
                        {section.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="form-group">
                                <label>{question}</label>
                                <div className="rating-boxes">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <div
                                            key={value}
                                            className={`rating-box ${responses[`${section.category}-${questionIndex}`] === value
                                                ? "selected"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                handleClick(section.category, questionIndex, value)
                                            }
                                        >
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit" className="questionnaire-submit-btn">Submit</button>
            </form>
        </div>
    );
};

export default Questionnaire;
