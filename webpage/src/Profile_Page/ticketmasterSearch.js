const axios = require("axios");

/* ---------------- Ticketmaster config ---------------- */
const API_KEY = "rIEc8705oO0lnG1uyrP9A5PI8Uiqason";          // your key
const TM_URL  = "https://app.ticketmaster.com/discovery/v2/events.json";
const RADII   = [15, 30, 60, 120, 250];                      // miles

/* ---------------- Personality → keyword pipe map ---------------- */
const keywordPipes = {
  "Reactive Idealist":
    "open mic|art show|indie concert|creative writing|spoken word|poetry slam|paint and sip|comedy night|zine fest|creative meetup",

  "Balanced Realist":
    "career workshop|professional networking|business panel|public speaking|goal setting|entrepreneur event|book club|project management|productivity workshop|industry mixer",

  "Sensitive Companion":
    "yoga class|guided meditation|healing circle|support group|mindfulness retreat|community volunteer|wellness workshop|plant care class|tea ceremony|small group discussion",

  "Secure Optimist":
    "music festival|leadership summit|motivational speaker|charity run|team building|networking gala|outdoor adventure|pitch competition|fitness challenge|TEDx"
};

/* ---------------- CLI args ---------------- */
const personalityType = process.argv[2] || "Reactive Idealist";
const zip             = process.argv[3] || "10001";           // default NY-Manhattan

if (!keywordPipes[personalityType]) {
  console.error("❌ Unknown personality:", personalityType);
  process.exit(1);
}

(async () => {
  console.log(`Searching Ticketmaster for ${personalityType} near ${zip} …`);

  const keyword = keywordPipes[personalityType];

  for (const radius of RADII) {
    try {
      const { data } = await axios.get(TM_URL, {
        params: {
          apikey: API_KEY,
          keyword,
          postalCode: zip,
          radius,
          unit: "miles",
          sort: "date,asc"
        }
      });

      const events = data?._embedded?.events || [];
      if (events.length) {
        console.log(`\n✅  Found ${events.length} events within ${radius} mi\n`);
        events.forEach((evt, idx) => {
          console.log(
            `#${idx + 1}  ${evt.name}\n` +
            `    ${evt.dates?.start?.localDate}\n` +
            `    ${evt._embedded?.venues?.[0]?.name} – ${evt._embedded?.venues?.[0]?.city?.name}\n` +
            `    ${evt.url}\n`
          );
        });
        return;
      } else {
        console.log(`No events within ${radius} mi … expanding.`);
      }
    } catch (err) {
      console.error(`Radius ${radius} mi error:`, err.message);
    }
  }

  /* -------- Virtual fallback -------- */
  try {
    const { data } = await axios.get(TM_URL, {
      params: { apikey: API_KEY, keyword: "virtual|online event" }
    });
    const events = data?._embedded?.events || [];
    if (events.length) {
      console.log("\n🌐  Showing virtual / online events\n");
      events.slice(0, 10).forEach((evt, idx) => {
        console.log(`#${idx + 1}  ${evt.name}\n    ${evt.url}\n`);
      });
    } else {
      console.log("No virtual events found either.");
    }
  } catch (err) {
    console.error("Virtual fetch error:", err.message);
  }
})();