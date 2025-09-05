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
        " You thrive on possibility. Bursting with ideas, you see patterns and connections others miss, and you’re quick to turn sparks of inspiration into action. Friends value your ability to bring color and energy into their lives — you’re often the one suggesting adventures, brainstorming late into the night, or offering fresh perspectives on old problems. At times, your enthusiasm can scatter your focus, but that same openness makes you adaptable and full of surprises. Whether through art, conversation, or creative projects, you shine brightest when you’re free to explore and share your imagination."
    },
    "Balanced Realist": {
      image: balanced,
      traits: "Practical • Steady • Mildly Social",
      description:
        "You’re grounded and steady, the kind of person who keeps both feet on the ground even when everyone else is chasing wild ideas. People turn to you because you balance curiosity with common sense — you’re adventurous enough to try new things, but wise enough to know your limits. In groups, you’re the quiet force of stability: reliable, thoughtful, and always willing to lend a hand. You might not chase the spotlight, but you’re the anchor that keeps projects (and friendships) on track. Your strength lies in knowing when to step forward and when to support from behind."
    },
    "Sensitive Companion": {
      image: sensitive,
      traits: "Supportive • Thoughtful • Introverted",
      description:
        "You lead with empathy. Deeply attuned to others, you notice the small things — a friend’s shift in mood, the unsaid worries in their voice. People often feel safe opening up to you because they know you’ll listen without judgment. You value loyalty, closeness, and meaningful bonds over surface-level connections. At times, your sensitivity can leave you feeling overwhelmed, but it also gives you the gift of creating warmth wherever you go. Whether through one-on-one talks, quiet creativity, or simply being present, you remind others that kindness and understanding matter."
    },
    "Secure Optimist": {
      image: secure,
      traits: "Adventurous • Confident • Motivational",
      description:
        "You approach life with energy and enthusiasm. Naturally upbeat, you’re the friend rallying everyone for a night out, the teammate setting ambitious goals, or the planner who somehow makes everything run smoothly. Challenges don’t discourage you — they motivate you, and your optimism inspires others to keep going too. Structure and clarity help you thrive, and you take pride in turning ideas into reality. While your drive can sometimes push you to take on too much, your confidence and positivity make you a natural motivator. You see life not just as something to be managed, but as an adventure to be embraced."
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

      {/* left: user words */}
      <div className="leftside">
        <h1>Your Personality Cluster: {cluster}</h1>
        <img src={detail.image} alt={cluster} />
        <h3>Open-Ended Response</h3>
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
