const express = require("express");
const Pool = require('pg').Pool;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express();

app.use(express.static('../public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});

//LOGIN PAGE
app.get("/", (req, res) => {
    res.redirect('/login.html');
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // hashing the password

    try {
        // Check if user already exists
        const exists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (exists.rows.length > 0) {
            res.send("User already exists!");
        } else {
            await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
            res.redirect("/login.html"); // Redirect to login page after successful registration
        }
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Internal server error during signup");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];

            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;  // Set user session
                res.redirect("/homepage.html");
            } else {
                res.redirect("/incorrectLogin.html");
            }
        } else {
            res.redirect("/incorrectLogin.html");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal server error");
    }
});



//LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Session destruction error:", error);
            res.status(500).send("Error logging out");
        } else {
            res.redirect("/login.html");
        }
    });
});

//LEADERBOARD
app.get("/leaderboard", async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM leaderboard ORDER BY points DESC');
        res.json(results.rows);
    } catch (error) {
        console.error("Error retrieving leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/updateLeaderboard", async (req, res) => {
    const { playerName, points } = req.body;
    try {
        const existingPlayerResult = await pool.query('SELECT * FROM leaderboard WHERE player_name = $1', [playerName]);

        if (existingPlayerResult.rows.length > 0) {
            const existingPoints = existingPlayerResult.rows[0].points;
            if (points > existingPoints) {
                await pool.query('UPDATE leaderboard SET points = $1 WHERE player_name = $2', [points, playerName]);
            }
        } else {
            await pool.query('INSERT INTO leaderboard (player_name, points) VALUES ($1, $2)', [playerName, points]);
        }
        res.status(200).json({ message: "Leaderboard updated" });
    } catch (error) {
        console.error("Error updating leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/updatePoints', (req, res) => {
    const userId = req.session.userId;
    const increaseBy = parseInt(req.body.increaseBy, 10);

    pool.query('UPDATE users SET points = points + $1 WHERE id = $2', [increaseBy, userId], (error, results) => {
        if (error) {
            console.error("Error updating points:", error);
            res.status(500).send("Internal server error");
        } else {
            res.status(200).send("Points updated successfully");
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});