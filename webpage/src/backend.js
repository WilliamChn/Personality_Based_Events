const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive questionnaire results
app.post("/api/save-results", (req, res) => {
    const results = req.body; // Expected: { Extraversion: number, "Emotional Stability": number, ... }

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
        const header = traits.join(",") + "\n";
        fs.writeFileSync(csvFilePath, header);
    }

    // Create a new line for the results
    const line = traits.map((trait) => results[trait]).join(",") + "\n";
    fs.appendFileSync(csvFilePath, line);

    res.status(200).send({ message: "Results saved successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});