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

    let resolutionStrategy = "Maintain consistent and clear communication.";
    // Send response to frontend
    res.status(200).send({
        message: "Results saved successfully",
        sentimentScores: sentimentScores,
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

        const sentimentScores = { compound: parseFloat(lastRow[5]) };

        let resolutionStrategy = "Maintain consistent and clear communication.";
        if (sentimentScores.compound > 0.8) {
            resolutionStrategy = "Your positive energy is contagious! Focus on building meaningful connections and shared goals to create a harmonious living space.";
        } else if (sentimentScores.compound > 0.5) {
            resolutionStrategy = "You have a positive outlook! Maintain collaboration and find shared activities to keep the relationship balanced and enjoyable.";
        } else if (sentimentScores.compound > 0.3) {
            resolutionStrategy = "You seem optimistic with some reservations. Encourage open communication while identifying opportunities for collaboration.";
        } else if (sentimentScores.compound >= -0.3) {
            resolutionStrategy = "Your response is balanced. Set clear expectations and maintain consistent, respectful communication to avoid misunderstandings.";
        } else if (sentimentScores.compound >= -0.5) {
            resolutionStrategy = "You may have specific concerns. Address any uncertainties with open communication and establish firm boundaries.";
        } else if (sentimentScores.compound >= -0.8) {
            resolutionStrategy = "It seems you may have some frustrations or concerns. Discuss expectations openly and consider compromises to create a healthier environment.";
        } else {
            resolutionStrategy = "Significant challenges or concerns are indicated. Prioritize addressing key issues directly and focus on establishing mutual understanding.";
        }

        res.json({
            adjustedScores,
            sentimentScores,
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