# OBS Spotify Music Overlay

A sleek, real-time Spotify track display for OBS, built with **HTML** and **Node.js**.  
Shows song title, artist, and optional album art — automatically updating to match your music.  
Fully customizable to fit your stream’s style.

## Features
- Real-time Spotify song updates  
- Displays **song title**, **artist**, and optional **album art**  
- Works as a **browser source** in OBS  
- Built with **HTML + Node.js**  
- Easy to customize

## 📦 Requirements
- **Node.js**
- **Spotify Developer Account** ([Create an app here](https://developer.spotify.com/dashboard))  
  - Get your **Client ID** and **Client Secret**  
  - Add a **Redirect URI** (e.g., `http://localhost:4422/callback`)  Change this on the server.js and overlay.js
- **OBS Studio** (latest version recommended)  
- Internet connection (very important)

## ⚙️ Installation
1. **Download the project**
   - Click the green **Code** button (top-right of this page)  
   - Select **Download ZIP**  
   - Extract the ZIP file to your desired folder

2. **Open a terminal in the project folder**

3. **Install dependencies**
   ```bash
   npm install

4. Configure Spotify credentials
- Open server.js
- Replace:
  ```bash
  const client_id = "YOUR_CLIENT_ID";
  const client_secret = "YOUR_CLIENT_SECRET";
  const redirect_uri = "YOUR_REDIRECT_URL";

5. Run the server
   ```bash
   node server.js

6. Log in to Spotify
- Visit (Your redirect URL) in your browser
- Click Log in with Spotify
- Approve permissions

7. Add to OBS
- Drag and drop the overlay.html file to OBS
- Double-click the file to adjust the size and position.
