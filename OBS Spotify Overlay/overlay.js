let currentTrackId = null;

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function checkPlayerState() {
    try {
        const response = await fetch("http://localhost:4422/player-state"); // Only change the port here (4422).
        if (!response.ok) {
            throw new Error("Failed to get player state");
        }
        
        const data = await response.json();
        
        if (data.state === "no_player") {
            updateUI({
                song: "No active player",
                artist: "",
                album: "",
                artwork: "",
                isPlaying: false,
                currentTime: 0,
                duration: 0
            });
            return;
        }

        if (data.item) {
            const updateData = {
                song: data.item.name,
                artist: data.item.artists.map(artist => artist.name).join(', '),
                album: data.item.album.name,
                artwork: data.item.album.images[0]?.url,
                isPlaying: data.is_playing,
                currentTime: data.progress_ms || 0,
                duration: data.item.duration_ms || 0
            };

            if (data.item.id !== currentTrackId) {
                currentTrackId = data.item.id;
                updateUI(updateData, true);
            } else {
                updateUI(updateData, false);
            }
        }
    } catch (error) {
        console.error("Error checking player state:", error);
    }
}

function updateUI(songData, isNewTrack) {
    const { song, artist, album, artwork, isPlaying, currentTime, duration } = songData;
    
    document.getElementById("song").textContent = song;
    document.getElementById("artist").textContent = artist;
    document.getElementById("album").textContent = album;
    
    const artworkEl = document.getElementById("artwork");
    if (artwork) {
        artworkEl.src = artwork;
        artworkEl.style.display = "block";
    } else {
        artworkEl.style.display = "none";
    }
    
    document.getElementById("status").textContent = isPlaying ? "" : "Paused";
    document.getElementById("current-time").textContent = formatTime(currentTime);
    document.getElementById("duration").textContent = `/ ${formatTime(duration)}`;
    
    if (isNewTrack) {
        document.getElementById("song").classList.add("track-change");
        document.getElementById("artist").classList.add("track-change");
        document.getElementById("album").classList.add("track-change");
        setTimeout(() => {
            document.getElementById("song").classList.remove("track-change");
            document.getElementById("artist").classList.remove("track-change");
            document.getElementById("album").classList.remove("track-change");
        }, 600);
    }
}

// Check every second
setInterval(checkPlayerState, 1000);
// Initial check
checkPlayerState();