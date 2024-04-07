const express = require("express");
const Pool = require('pg').Pool;
const app = express();
const bodyParser = require("body-parser");

app.use(express.static('../public'));
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});

// leaderboard data
const leaderboardData = [
    { rank: "Flame Ruby", playerName: "Firecaster", points: 1000 },
    { rank: "Frost Sapphire", playerName: "Iceweaver", points: 950 },
    { rank: "Earth Emerald", playerName: "Rockshaper", points: 900 },
    { rank: "Storm Topaz", playerName: "Thunderstruck", points: 850 },
    { rank: "Shadow Onyx", playerName: "Darkcloak", points: 800 }
];

// leaderboard
app.get("/leaderboard", (req, res) => {
    res.json(leaderboardData);
});

// contact form
app.post("/contact", (req, res) => {
    const { name, email, message, option } = req.body;

    // insert into base
    pool.query('INSERT INTO contact_forms (name, email, message, option) VALUES ($1, $2, $3, $4)', 
    [name, email, message, option], 
    (error, results) => {
        if (error) {
            console.error("Error inserting contact form data:", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json({ message: "Contact form submitted successfully" });
        }
    });
});

// login stuff
app.get("/", (req, res) => {
    res.redirect('/login.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});