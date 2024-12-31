const searchInput = document.getElementById('artist-name');
const resultsDiv = document.getElementById('autocomplete-results');
const gameDiv = document.getElementById('game'); // Game container

// Function to display search results dynamically
const displayResults = (results) => {
    resultsDiv.innerHTML = '';
    if (results.length === 0) {
        resultsDiv.style.display = 'none';
        return;
    }

    results.forEach((artist) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.textContent = artist.name;

        // Click behavior to select an artist and start the game
        resultItem.addEventListener('click', async () => {
            resultsDiv.style.display = 'none';
            searchInput.value = artist.name; // Autofill search bar
            await startGame(artist.id); // Start the game with the selected artist
        });

        resultsDiv.appendChild(resultItem);
    });

    resultsDiv.style.display = 'block';
};

// Start the game with the artist's top tracks
const startGame = async (artistId) => {
    try {
        const response = await fetch(`/artist/${artistId}/top-tracks`);
        const tracks = await response.json();

        if (tracks.length === 0) {
            gameDiv.innerHTML = '<p>No tracks available for this artist.</p>';
            return;
        }
 
        playGame(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        gameDiv.innerHTML = '<p>Error loading the game. Please try again.</p>';
    }
};

// Game logic
const playGame = (tracks) => {
    let currentTrackIndex = 0;
    let score = 0;

    // Function to play a track snippet
    const playTrack = (track) => {
        gameDiv.innerHTML = `
            <p>Guess the song title:</p>
            <audio controls autoplay>
                <source src="${track.preview_url}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <input type="text" id="guess-input" placeholder="Enter your guess..." />
            <button id="submit-guess">Submit Guess</button>
        `;

        // Add event listener for the submit button
        document.getElementById('submit-guess').addEventListener('click', () => {
            const userGuess = document.getElementById('guess-input').value.trim().toLowerCase();
            if (userGuess === track.name.toLowerCase()) {
                score++;
                alert('Correct!');
            } else {
                alert(`Wrong! The correct answer was: ${track.name}`);
            }

            // Move to the next track or end the game
            currentTrackIndex++;
            if (currentTrackIndex < tracks.length) {
                playTrack(tracks[currentTrackIndex]);
            } else {
                endGame(score, tracks.length);
            }
        });
    };

    // Start with the first track
    playTrack(tracks[currentTrackIndex]);
};

// End the game
const endGame = (score, total) => {
    gameDiv.innerHTML = `
        <p>Game Over! You scored ${score} out of ${total}.</p>
        <button id="restart-game">Play Again</button>
    `;

    // Restart the game
    document.getElementById('restart-game').addEventListener('click', () => {
        gameDiv.innerHTML = '';
    });
};

// Listen for search input
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();

    if (query.length === 0) {
        resultsDiv.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        const artists = await response.json();
        displayResults(artists);
    } catch (error) {
        console.error('Error fetching artists:', error);
    }
});
