import React, { useState } from 'react';
import { supabase } from '../supabase'; // Import your Supabase client
import { useNavigate } from 'react-router-dom';
import './signup.css';

const SignupPage = ({ setUserData }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        bio: '',
        interests: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, username, email, password, gender, bio, interests } = formData;

        try {
            // Sign up user in Supabase Authentication
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            // Insert user data into the 'users' table
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        email,
                        password, // WARNING: Avoid storing plaintext passwords in production
                        created_at: new Date(),
                        username,

                    },
                ]);

            if (insertError) {
                throw insertError;
            }

            // Save user data locally and navigate
            setUserData({ email, firstName, lastName, username, gender, bio, interests });
            alert('Signup successful!');
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Error during sign-up:', error.message);
            setError('Failed to sign up. Please try again.');
        }
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
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter a password"
                        value={formData.password}
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
                        <option value="other">Other</option>
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

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="signup-submit-btn">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
