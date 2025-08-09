const express = require("express");
const request = require("request");
const cors = require("cors");
const querystring = require("querystring");

const app = express();
const port = 4422;

// ==== SPOTIFY CREDENTIALS ====
const client_id = "YOUR_CLIENT_ID";
const client_secret = "YOUR_CLIENT_SECRET";
const redirect_uri = "YOUR_REDIRECT_URL";

app.use(cors());

let access_token = null;
let refresh_token = null;
let lastPlayerState = null;

// Root route
app.get("/", (req, res) => {
    res.send(`
        <h1>Spotify Auth Test</h1>
        <a href="/login">Log in with Spotify</a>
    `);
});

// Login route
app.get("/login", (req, res) => {
    const scope = "user-read-currently-playing user-read-playback-state";
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri
        })
    );
});

// Callback route
app.get("/callback", (req, res) => {
    const code = req.query.code || null;

    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: "authorization_code"
        },
        headers: {
            Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64")
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            refresh_token = body.refresh_token;
            res.send("✅ Login successful! The overlay should now work.");
        } else {
            console.error(body);
            res.send("❌ Error getting tokens.");
        }
    });
});

// Token route
app.get("/token", (req, res) => {
    res.json({ access_token });
});

// Player state route
app.get("/player-state", async (req, res) => {
    if (!access_token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (response.status === 204) {
            return res.json({ state: "no_player" });
        }

        const data = await response.json();
        lastPlayerState = data;
        res.json(data);
    } catch (error) {
        console.error("Error fetching player state:", error);
        res.status(500).json({ error: "Failed to get player state" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}`); // Change the IP if you create a new application for spotify.
});