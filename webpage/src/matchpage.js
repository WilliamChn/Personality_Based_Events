import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./matchpage.css";

const profiles = [
    { id: 1, name: "Ashley Martin", personality: "Dynamic Dreamer", bio: "Loves coding and gaming.", interests: ["Music", "Books", "Travel"] },
    { id: 2, name: "Paige Davis", personality: "Harmonious Explorer", bio: "Passionate about community service.", interests: ["Chess", "Music", "Nature"] },
    { id: 3, name: "Ashley Mitchell", personality: "Harmonious Explorer", bio: "Enjoys crafting and DIY projects.", interests: ["Nature", "Gardening", "Sustainability"] },
    { id: 4, name: "Justin Anderson", personality: "Dynamic Dreamer", bio: "Enjoys hiking and photography.", interests: ["Gym", "Music", "Nature"] },
    { id: 5, name: "Rachel Lewis", personality: "Harmonious Explorer", bio: "Dreams of starting their own business someday.", interests: ["Sustainability", "Travel", "Gaming"] },
    { id: 6, name: "Jeffrey Brown", personality: "Grounded Visionary", bio: "Always up for outdoor adventures.", interests: ["Photography", "Art", "Fitness"] },
    { id: 7, name: "Patricia White", personality: "Zen Socialite", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Music"] },
    { id: 8, name: "Debbie Gonzalez", personality: "Zen Socialite", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Nature", "Books"] },
    { id: 9, name: "Richard Taylor", personality: "Harmonious Explorer", bio: "Music lover who plays guitar.", interests: ["Music", "Art", "Fitness"] },
    { id: 10, name: "Nathaniel Lee", personality: "Harmonious Explorer", bio: "Enjoys cooking and trying new recipes.", interests: ["Cooking", "Travel", "Fitness"] },
    { id: 11, name: "Randy Miller", personality: "Zen Socialite", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Gardening", "DIY"] },
    { id: 12, name: "John Wilson", personality: "Grounded Visionary", bio: "Enjoys crafting and DIY projects.", interests: ["DIY", "Fitness", "Art"] },
    { id: 13, name: "Stephen Martinez", personality: "Grounded Visionary", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Movies"] },
    { id: 14, name: "Jennifer Lopez", personality: "Zen Socialite", bio: "Enjoys hiking and photography.", interests: ["Nature", "Travel", "Photography"] },
    { id: 15, name: "Patrick Garcia", personality: "Grounded Visionary", bio: "Dreams of starting their own business someday.", interests: ["Business", "Travel", "Books"] },
    { id: 16, name: "Andrew Hernandez", personality: "Chill Optimizer", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Music", "Cooking"] },
    { id: 17, name: "Johnathan Clark", personality: "Harmonious Explorer", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Books", "Music"] },
    { id: 18, name: "Carrie Harris", personality: "Dynamic Dreamer", bio: "Always up for outdoor adventures.", interests: ["Hiking", "Nature", "Gym"] },
    { id: 19, name: "Frank Sanchez", personality: "Dynamic Dreamer", bio: "Music lover who plays guitar.", interests: ["Music", "Art", "Movies"] },
    { id: 20, name: "Victoria Robinson", personality: "Dynamic Dreamer", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "DIY", "Gardening"] },
    { id: 21, name: "Taylor Walker", personality: "Dynamic Dreamer", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Fitness"] },
    { id: 22, name: "Daniel Young", personality: "Zen Socialite", bio: "Enjoys cooking and trying new recipes.", interests: ["Cooking", "Music", "Art"] },
    { id: 23, name: "Jacob Allen", personality: "Chill Optimizer", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Gaming"] },
    { id: 24, name: "Amanda King", personality: "Dynamic Dreamer", bio: "Enjoys crafting and DIY projects.", interests: ["DIY", "Sustainability", "Art"] },
    { id: 25, name: "Robert Wright", personality: "Zen Socialite", bio: "Always up for outdoor adventures.", interests: ["Hiking", "Photography", "Travel"] },
    { id: 26, name: "Elizabeth Scott", personality: "Harmonious Explorer", bio: "Loves coding and gaming.", interests: ["Technology", "Gaming", "Books"] },
    { id: 27, name: "Joshua Torres", personality: "Zen Socialite", bio: "Passionate about community service.", interests: ["Volunteering", "Cooking", "Gardening"] },
    { id: 28, name: "Mary Nguyen", personality: "Dynamic Dreamer", bio: "Music lover who plays guitar.", interests: ["Music", "Movies", "Fitness"] },
    { id: 29, name: "Joseph Hill", personality: "Zen Socialite", bio: "Dreams of starting their own business someday.", interests: ["Business", "Technology", "Travel"] },
    { id: 30, name: "Julia Flores", personality: "Chill Optimizer", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Books", "Movies"] },
    { id: 31, name: "Denise Green", personality: "Dynamic Dreamer", bio: "Enjoys crafting and DIY projects.", interests: ["DIY", "Art", "Sustainability"] },
    { id: 32, name: "Victoria Adams", personality: "Zen Socialite", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Cooking"] },
    { id: 33, name: "Megan Nelson", personality: "Grounded Visionary", bio: "Always up for outdoor adventures.", interests: ["Photography", "Nature", "Fitness"] },
    { id: 34, name: "Emily Baker", personality: "Harmonious Explorer", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Travel", "Gardening"] },
    { id: 35, name: "Christopher Hall", personality: "Harmonious Explorer", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Gaming"] },
    { id: 36, name: "Shari Rivera", personality: "Chill Optimizer", bio: "Enjoys hiking and photography.", interests: ["Nature", "Photography", "Fitness"] },
    { id: 37, name: "Loretta Campbell", personality: "Harmonious Explorer", bio: "Passionate about community service.", interests: ["Volunteering", "Gardening", "Cooking"] },
    { id: 38, name: "Jason Mitchell", personality: "Grounded Visionary", bio: "Music lover who plays guitar.", interests: ["Music", "Art", "Movies"] },
    { id: 39, name: "Jonathan Carter", personality: "Chill Optimizer", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Books", "History"] },
    { id: 40, name: "Tyrone Roberts", personality: "Grounded Visionary", bio: "Dreams of starting their own business someday.", interests: ["Business", "Technology", "Travel"] },
    { id: 41, name: "Evan Gomez", personality: "Chill Optimizer", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Gaming", "Fitness"] },
    { id: 42, name: "Craig Phillips", personality: "Dynamic Dreamer", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Gardening", "Cooking"] },
    { id: 43, name: "Anne Parker", personality: "Chill Optimizer", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Movies"] },
    { id: 44, name: "Colleen Edwards", personality: "Zen Socialite", bio: "Loves coding and gaming.", interests: ["Technology", "Gaming", "Books"] },
    { id: 45, name: "Dwayne Collins", personality: "Grounded Visionary", bio: "Enjoys crafting and DIY projects.", interests: ["DIY", "Art", "Photography"] },
    { id: 46, name: "Paige Stewart", personality: "Harmonious Explorer", bio: "Always up for outdoor adventures.", interests: ["Nature", "Travel", "Fitness"] },
    { id: 47, name: "Matthew Ramirez", personality: "Dynamic Dreamer", bio: "Music lover who plays guitar.", interests: ["Music", "Movies", "Art"] },
    { id: 48, name: "Michelle Watson", personality: "Zen Socialite", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Gaming"] },
    { id: 49, name: "George Diaz", personality: "Grounded Visionary", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Books", "History"] },
    { id: 50, name: "David Torres", personality: "Chill Optimizer", bio: "Dreams of starting their own business someday.", interests: ["Business", "Technology", "Fitness"] },
    { id: 51, name: "Sean Lopez", personality: "Chill Optimizer", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Gardening", "Cooking"] },
    { id: 52, name: "Sydney Nguyen", personality: "Dynamic Dreamer", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Movies"] },
    { id: 53, name: "Paul Wilson", personality: "Zen Socialite", bio: "Enjoys hiking and photography.", interests: ["Nature", "Photography", "Travel"] },
    { id: 54, name: "Robyn Moore", personality: "Grounded Visionary", bio: "Loves crafting and DIY projects.", interests: ["DIY", "Art", "Sustainability"] },
    { id: 55, name: "Rachel Young", personality: "Grounded Visionary", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Gaming"] },
    { id: 56, name: "Scott Allen", personality: "Chill Optimizer", bio: "Always up for outdoor adventures.", interests: ["Nature", "Travel", "Fitness"] },
    { id: 57, name: "Eric King", personality: "Grounded Visionary", bio: "Music lover who plays guitar.", interests: ["Music", "Movies", "Photography"] },
    { id: 58, name: "Clinton Wright", personality: "Zen Socialite", bio: "Dreams of starting their own business someday.", interests: ["Business", "Technology", "Cooking"] },
    { id: 59, name: "Stacey Harris", personality: "Grounded Visionary", bio: "Enjoys coding and gaming.", interests: ["Technology", "Gaming", "Books"] },
    { id: 60, name: "Larry Walker", personality: "Dynamic Dreamer", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Gardening", "DIY"] },
    { id: 61, name: "Veronica Hill", personality: "Harmonious Explorer", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Fitness"] },
    { id: 62, name: "Rebecca Scott", personality: "Chill Optimizer", bio: "Always up for outdoor adventures.", interests: ["Hiking", "Nature", "Movies"] },
    { id: 63, name: "Douglas Torres", personality: "Chill Optimizer", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Books", "Art"] },
    { id: 64, name: "April Adams", personality: "Chill Optimizer", bio: "Enjoys crafting and DIY projects.", interests: ["DIY", "Art", "Photography"] },
    { id: 65, name: "Justin Nelson", personality: "Zen Socialite", bio: "Passionate about community service.", interests: ["Volunteering", "Gardening", "Cooking"] },
    { id: 66, name: "Natalie Baker", personality: "Harmonious Explorer", bio: "Loves coding and gaming.", interests: ["Technology", "Gaming", "Books"] },
    { id: 67, name: "Sandra Hall", personality: "Zen Socialite", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Music", "Cooking"] },
    { id: 68, name: "Ashley Green", personality: "Grounded Visionary", bio: "Dreams of starting their own business someday.", interests: ["Business", "Travel", "Art"] },
    { id: 69, name: "Cristina Rivera", personality: "Chill Optimizer", bio: "Music lover who plays guitar.", interests: ["Music", "Art", "Photography"] },
    { id: 70, name: "Austin Collins", personality: "Grounded Visionary", bio: "Always up for outdoor adventures.", interests: ["Nature", "Fitness", "Travel"] },
    { id: 71, name: "Darius Perez", personality: "Zen Socialite", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Gardening", "DIY"] },
    { id: 72, name: "James Mitchell", personality: "Harmonious Explorer", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Movies"] },
    { id: 73, name: "Aaron Taylor", personality: "Chill Optimizer", bio: "Enjoys hiking and photography.", interests: ["Photography", "Nature", "Travel"] },
    { id: 74, name: "Jill Martin", personality: "Grounded Visionary", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Music"] },
    { id: 75, name: "Gail Hernandez", personality: "Zen Socialite", bio: "Always up for outdoor adventures.", interests: ["Hiking", "Photography", "Fitness"] },
    { id: 76, name: "Veronica Carter", personality: "Harmonious Explorer", bio: "Dreams of starting their own business someday.", interests: ["Business", "Technology", "Books"] },
    { id: 77, name: "Rebecca Martinez", personality: "Chill Optimizer", bio: "Enjoys crafting and DIY projects.", interests: ["DIY", "Art", "Sustainability"] },
    { id: 78, name: "Douglas Lopez", personality: "Chill Optimizer", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Books", "Movies"] },
    { id: 79, name: "April Brown", personality: "Chill Optimizer", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Gardening", "DIY"] },
    { id: 80, name: "Justin Johnson", personality: "Zen Socialite", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Gaming", "Cooking"] },
    { id: 81, name: "Natalie Williams", personality: "Harmonious Explorer", bio: "Always up for outdoor adventures.", interests: ["Travel", "Fitness", "Music"] },
    { id: 82, name: "Sandra Harris", personality: "Zen Socialite", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Movies", "Art"] },
    { id: 83, name: "Ashley Martinez", personality: "Grounded Visionary", bio: "Enjoys crafting and DIY projects.", interests: ["DIY", "Art", "Photography"] },
    { id: 84, name: "Cristina Garcia", personality: "Chill Optimizer", bio: "Music lover who plays guitar.", interests: ["Music", "Movies", "Books"] },
    { id: 85, name: "Austin Taylor", personality: "Grounded Visionary", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Travel", "Art"] },
    { id: 86, name: "Darius Hall", personality: "Zen Socialite", bio: "Always up for outdoor adventures.", interests: ["Hiking", "Photography", "Cooking"] },
    { id: 87, name: "James Baker", personality: "Harmonious Explorer", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Music"] },
    { id: 88, name: "Aaron Adams", personality: "Chill Optimizer", bio: "Dreams of starting their own business someday.", interests: ["Business", "Technology", "Travel"] },
    { id: 89, name: "Jill Wilson", personality: "Grounded Visionary", bio: "Loves solving puzzles and playing chess.", interests: ["Chess", "Books", "Art"] },
    { id: 90, name: "Gail Martinez", personality: "Zen Socialite", bio: "Enjoys hiking and photography.", interests: ["Nature", "Photography", "Fitness"] },
    { id: 91, name: "Veronica Perez", personality: "Harmonious Explorer", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Fitness"] },
    { id: 92, name: "Rebecca Gonzalez", personality: "Chill Optimizer", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Music"] },
    { id: 93, name: "Douglas Ramirez", personality: "Chill Optimizer", bio: "Always up for outdoor adventures.", interests: ["Hiking", "Nature", "Movies"] },
    { id: 94, name: "April Carter", personality: "Chill Optimizer", bio: "Music lover who plays guitar.", interests: ["Music", "Art", "Photography"] },
    { id: 95, name: "Justin White", personality: "Zen Socialite", bio: "Dreams of starting their own business someday.", interests: ["Business", "Travel", "Cooking"] },
    { id: 96, name: "Natalie Lee", personality: "Harmonious Explorer", bio: "Passionate about sustainability and eco-friendly living.", interests: ["Sustainability", "Gardening", "DIY"] },
    { id: 97, name: "Sandra Collins", personality: "Zen Socialite", bio: "Sports fan who loves playing basketball.", interests: ["Sports", "Gym", "Movies"] },
    { id: 98, name: "Ashley Walker", personality: "Grounded Visionary", bio: "Always up for outdoor adventures.", interests: ["Nature", "Photography", "Travel"] },
    { id: 99, name: "Cristina Allen", personality: "Chill Optimizer", bio: "Big fan of movies and TV shows.", interests: ["Movies", "Books", "Gaming"] },
    { id: 100, name: "Austin Taylor", personality: "Grounded Visionary", bio: "Music lover who plays guitar.", interests: ["Music", "Fitness", "Art"] }
];

// const MatchPage = ({ userCluster, userProfile }) => {
//     const navigate = useNavigate();
//     console.log("User Profile in MatchPage:", userProfile);

//     return (
//         <div className="match-container">
//             <h1>Explore Profiles</h1>
//             <p>Your Cluster: <strong>{userCluster}</strong></p>
//             <div className="profiles-container">
//                 {profiles.map((profile) => (
//                     <div
//                         key={profile.id}
//                         className="profile-card"
//                         onClick={() =>
//                             navigate(`/profile/${profile.name}`, {
//                                 state: { userProfile, matchedProfile: profile },
//                             })
//                         }
//                     >
//                         <h3>{profile.name}</h3>
//                         <p><strong>Personality:</strong> {profile.personality}</p>
//                         <p><strong>Bio:</strong> {profile.bio}</p>
//                         <p><strong>Interests:</strong> {profile.interests.join(", ")}</p>
//                         {profile.personality === userCluster && (
//                             <div className="recommended">Recommended for You</div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default MatchPage;

const MatchPage = ({ userCluster, userProfile }) => {
    const navigate = useNavigate();
    const [hoveredProfile, setHoveredProfile] = useState(null);

    const filteredProfiles = profiles.filter(profile => profile.personality === userCluster);

    return (
        <div className="match-container">
            <h1>Find Your Match</h1>
            <p>Your Cluster: <strong>{userCluster}</strong></p>
            <div className="profiles-container">
                {profiles.map(profile => (
                    <div
                        key={profile.id}
                        className="profile-card"
                        onClick={() => navigate(`/profile/${profile.name}`, {state: { userProfile, matchedProfile: profile}, })} // Navigate to the profile's page
                        onMouseEnter={() => setHoveredProfile(profile)} // Set hovered profile
                        onMouseLeave={() => setHoveredProfile(null)} // Clear hovered profile
                        style={{ cursor: "pointer" }}
                    >
                        <h3>{profile.name}</h3>
                        <p>{profile.personality}</p>
                        {hoveredProfile === profile && (
                            <div className="hover-card">
                                <p><strong>Bio:</strong> {profile.bio}</p>
                                <p><strong>Interests:</strong> {profile.interests.join(", ")}</p>
                            </div>
                        )}
                        {profile.personality === userCluster && (
                            <div className="recommended">Recommended for You</div>
                        )}
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
