// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";              // <-- adjust path if needed
import "./profilepage.css";                          // <-- adjust path if needed

/* Cluster images (update paths if different) */
import reactive  from "../images/chill_optimizer.webp";
import balanced  from "../images/dynamic_dreamer.webp";
import sensitive from "../images/zen_socialite.webp";
import secure    from "../images/grounded_visionary.png";

/* Ticketmaster client */
import { fetchTicketmasterEvents } from "../api/ticketmaster";

/**
 * ProfilePage
 * Fetches:
 *   - current user ZIP (temporarily stored in user_data.city)
 *   - personality cluster & open-ended response (user_personality_data)
 * Then loads Ticketmaster events keyed off personality + ZIP and displays them.
 */
const ProfilePage = ({ setUserCluster }) => {
  /* personality + free text */
  const [personalityData, setPersonalityData] = useState(null);
  const [openEndedResponse, setOpenEndedResponse] = useState("");

  /* user ZIP + events */
  const [userZip, setUserZip] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  /* cluster lookup */
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
        "Prefers deeper 1:1 or small group spaces. Loyal and observant."
    },
    "Secure Optimist": {
      image: secure,
      traits: "Adventurous • Confident • Motivational",
      description:
        "Energized by people and possibility. Loves big ideas and bigger gatherings."
    }
  };

  /* fetch logged-in user ZIP (stored in user_data.city for now) */
  useEffect(() => {
    (async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        console.error("auth getUser error:", userErr);
        return;
      }
      if (!user) return;

      const { data, error } = await supabase
        .from("user_data")
        .select("city") // ← store ZIP here (change to zip if you add that column)
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("fetch user_data error:", error);
        return;
      }
      if (data?.city) setUserZip(String(data.city).trim());
    })();
  }, []);

  /* fetch personality data */
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_personality_data")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("fetch personality error:", error.message);
        return;
      }

      setPersonalityData(data);
      setOpenEndedResponse(data.open_ended || "");
      setUserCluster?.(data.personality_type);
    })();
  }, [setUserCluster]);

  /* fetch events when we have both personality & ZIP */
  useEffect(() => {
    if (!personalityData || !userZip) return;

    let cancel = false;
    (async () => {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const evts = await fetchTicketmasterEvents(
          personalityData.personality_type,
          userZip,
          25
        );
        if (!cancel) setEvents(evts);
      } catch (err) {
        if (!cancel) setEventsError(err?.message || "Event load failed");
      } finally {
        if (!cancel) setEventsLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [personalityData, userZip]);

  /* guard while loading personality */
  if (!personalityData) return <div>Loading...</div>;

  const cluster = personalityData.personality_type || "Balanced Realist";
  const detail =
    personalityClusters[cluster] || personalityClusters["Balanced Realist"];

  return (
    <div className="profile-container">
      {/* top cluster card */}
      <div className="headercard">
        <img src={detail.image} alt={cluster} />
        <h2>{cluster}</h2>
      </div>

      {/* left: user words */}
      <div className="leftside">
        <h3>Your Words</h3>
        <p>{openEndedResponse}</p>
      </div>

      {/* right: traits + description */}
      <div className="rightside">
        <h3>Key Traits</h3>
        <p>{detail.traits}</p>

        <h3>Description</h3>
        <p>{detail.description}</p>
      </div>

      {/* events */}
      <div className="events-section">
        <h2>Events near {userZip || "you"}</h2>
        {eventsLoading && <p>Loading events…</p>}
        {eventsError && <p className="error">{eventsError}</p>}
        {!eventsLoading && !eventsError && events.length === 0 && (
          <p>No matching local events found. (We widen the search and then show virtual events.)</p>
        )}
        <ul className="event-list">
          {events.map(evt => (
            <li key={evt.id} className="event-card">
              {evt.imageUrl && (
                <img src={evt.imageUrl} alt={evt.name} className="event-img" />
              )}
              <div className="event-info">
                <a
                  href={evt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="event-name"
                >
                  {evt.name}
                </a>
                <p className="event-meta">
                  {evt.date}
                  {evt.venueName ? ` • ${evt.venueName}` : ""}
                  {evt.venueCity ? ` • ${evt.venueCity}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
