import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./profilepage.css";

/* ---- cluster images (adapt paths as needed) ---- */
import reactive from "../images/chill_optimizer.webp";
import balanced from "../images/dynamic_dreamer.webp";
import sensitive from "../images/zen_socialite.webp";
import secure from "../images/grounded_visionary.png";

const ProfilePage = ({ setUserCluster }) => {
  /* ---------- state ---------- */
  const [personalityData, setPersonalityData] = useState(null);
  const [openEndedResponse, setOpenEndedResponse] = useState("");

  /* ---------- cluster dictionary ---------- */
  const personalityClusters = {
    "Reactive Idealist": {
      image: reactive,
      traits: "Expressive • Imaginative • Spontaneous",
      description:
        "Creative, people-oriented, sometimes a bit scattered but full of fresh ideas."
    },
    "Balanced Realist": {
      image: balanced,
      traits: "Practical • Steady • Mildly Social",
      description:
        "Grounded and dependable with a dash of curiosity. Keeps projects (and friends) on track."
    },
    "Sensitive Companion": {
      image: sensitive,
      traits: "Supportive • Thoughtful • Introverted",
      description:
        "Empathetic listeners who value harmony and close-knit connections."
    },
    "Secure Optimist": {
      image: secure,
      traits: "Confident • Outgoing • Organized",
      description:
        "Positive, energetic, and goal-driven — always ready to explore and lead."
    }
  };

  /* ---------- fetch personality once ---------- */
  useEffect(() => {
    const fetchPersonality = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return console.error("No logged-in user.");

      const { data, error } = await supabase
        .from("user_personality_data")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) return console.error("Supabase fetch error:", error.message);

      setPersonalityData(data);
      setOpenEndedResponse(data.open_ended || "");
      setUserCluster?.(data.personality_type); // lift state if parent needs it
    };

    fetchPersonality();
  }, [setUserCluster]);

  /* ---------- loading guard ---------- */
  if (!personalityData) return <div>Loading...</div>;

  const cluster = personalityData.personality_type || "Balanced Realist";
  const detail = personalityClusters[cluster] || personalityClusters["Balanced Realist"];

  /* ---------- render ---------- */
  return (
    <div className="profile-container">
      <div className="leftside">
        <h1>Your Personality Cluster: {cluster}</h1>
        <img src={detail.image} alt={cluster} />
        <h3>Open-Ended Response</h3>
        <p>{openEndedResponse}</p>
      </div>

      <div className="rightside">
        <h3>Key Traits</h3>
        <p>{detail.traits}</p>

        <h3>Description</h3>
        <p>{detail.description}</p>
      </div>
    </div>
  );
};

export default ProfilePage;