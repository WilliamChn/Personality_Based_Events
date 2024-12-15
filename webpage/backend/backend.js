const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const vader = require("vader-sentiment"); // Import VADER for sentiment analysis

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to receive questionnaire results
app.post("/api/save-results", (req, res) => {
    const results = req.body; // Expected: { Extraversion, Emotional Stability, ..., openEnded }
    console.log("POST /api/save-results hit with body:", results);

    const openEndedResponse = results.openEnded || ""; // Retrieve open-ended response
    console.log("Open-ended response received:", openEndedResponse);

    // Perform sentiment analysis
    const sentimentScores = vader.SentimentIntensityAnalyzer.polarity_scores(openEndedResponse);
    console.log("Sentiment scores calculated:", sentimentScores);

    // Path to the CSV file
    const csvFilePath = path.join(__dirname, "results.csv");

    // Check if the file exists
    const fileExists = fs.existsSync(csvFilePath);

    // Define the traits in a consistent order
    const traits = [
        "Extraversion",
        "Emotional Stability",
        "Agreeableness",
        "Conscientiousness",
        "Openness",
    ];

    if (!fileExists) {
        // Write the header row
        const header = traits.join(",") + ",SentimentCompound\n";
        fs.writeFileSync(csvFilePath, header);
    }

    // Create a new line for the results (including sentiment compound score)
    const line =
        traits.map((trait) => results[trait]).join(",") + `,${sentimentScores.compound}\n`;
    fs.appendFileSync(csvFilePath, line);
    console.log("Results saved to CSV successfully!");

    // Determine resolution strategy based on sentiment
    let resolutionStrategy;
    if (sentimentScores.compound > 0.5) {
        resolutionStrategy = "Focus on collaboration and shared goals to build a harmonious relationship.";
    } else if (sentimentScores.compound < -0.5) {
        resolutionStrategy = "Encourage open communication and set clear boundaries to resolve conflicts.";
    } else {
        resolutionStrategy = "Maintain consistent and clear communication to avoid misunderstandings.";
    }
    console.log("Selected resolution strategy:", resolutionStrategy);

    // Send response to frontend
    res.status(200).send({
        message: "Results saved successfully",
        sentiment: sentimentScores,
        resolutionStrategy: resolutionStrategy,
    });
});

// Endpoint to fetch the latest results
app.get("/api/get-results", (req, res) => {
    const csvFilePath = path.join(__dirname, "results.csv");

    fs.readFile(csvFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading CSV file:", err);
            return res.status(500).json({ error: "Failed to retrieve results." });
        }

        const rows = data.trim().split("\n");
        const lastRow = rows[rows.length - 1].split(",");
        console.log("Last row fetched from CSV:", lastRow);

        const adjustedScores = {
            Extraversion: parseFloat(lastRow[0]),
            "Emotional Stability": parseFloat(lastRow[1]),
            Agreeableness: parseFloat(lastRow[2]),
            Conscientiousness: parseFloat(lastRow[3]),
            Openness: parseFloat(lastRow[4]),
        };

        const sentiment = { compound: parseFloat(lastRow[5]) };

        let resolutionStrategy = "Maintain consistent and clear communication.";
        if (sentiment.compound > 0.30) {
            resolutionStrategy = "Focus on collaboration and shared goals.";
        } else if (sentiment.compound < -0.30) {
            resolutionStrategy = "Encourage open communication and set clear boundaries.";
        }

        res.json({
            adjustedScores,
            sentiment,
            resolutionStrategy,
        });
    });
});

// Test VADER Sentiment Analysis in isolation
const testText = "I hate everything.";
const testSentiment = vader.SentimentIntensityAnalyzer.polarity_scores(testText);
console.log("Test sentiment analysis:", testSentiment);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});