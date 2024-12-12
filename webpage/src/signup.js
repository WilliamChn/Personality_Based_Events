import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Signup CSS file

const SignupPage = ({ setUserData }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        gender: '',
        bio: '',
        interests: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            name: `${formData.firstName} ${formData.lastName}`,
            bio: formData.bio,
            interests: formData.interests.split(',').map((interest) => interest.trim()),
        };
        console.log("Form submitted:", formData);
        setUserData(userData); // Called during form submission
        console.log("User Data in SignupPage:", userData);
        alert("Signup successful!");
        navigate("/questionnaire");
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter a valid email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="nonbinary">Non-binary</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        placeholder="Write a bio about yourself"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label>Interests</label>
                    <textarea
                        name="interests"
                        placeholder="List your interests (e.g., reading, gaming)"
                        value={formData.interests}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <button type="submit" className="signup-submit-btn">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
