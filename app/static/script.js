const searchInput = document.getElementById('artist-name');
const resultsDiv = document.getElementById('autocomplete-results');
const gameDiv = document.getElementById('game'); // Add a div for the game
let selectedArtist = null;

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

        // Click behavior to select an artist and fetch top tracks
        resultItem.addEventListener('click', async () => {
            selectedArtist = artist; // Save the selected artist
            resultsDiv.style.display = 'none';
            searchInput.value = artist.name; // Autofill the search bar
            await fetchTopTracks(artist.id); // Fetch the artist's top tracks
        });

        resultsDiv.appendChild(resultItem);
    });

    resultsDiv.style.display = 'block';
};

// Fetch the top tracks for the selected artist
const fetchTopTracks = async (artistId) => {
    try {
        const response = await fetch(`/artist/${artistId}/top-tracks`);
        const tracks = await response.json();
        startGame(tracks); // Start the game with the fetched tracks
    } catch (error) {
        console.error('Error fetching top tracks:', error);
    }
};

// Start the game with the artist's top tracks
const startGame = (tracks) => {
    gameDiv.innerHTML = ''; // Clear previous game state

    if (tracks.length === 0) {
        gameDiv.innerHTML = '<p>No tracks available for this artist.</p>';
        return;
    }

    // Display the first track snippet and options
    let currentTrackIndex = 0;
    const playTrack = (track) => {
        gameDiv.innerHTML = `
            <p>Guess the song:</p>
            <audio controls autoplay>
                <source src="${track.preview_url}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <button onclick="revealAnswer()">Reveal Answer</button>
        `;
    };

    playTrack(tracks[currentTrackIndex]);

    // Reveal the answer and move to the next track
    window.revealAnswer = () => {
        alert(`The song was: ${tracks[currentTrackIndex].name}`);
        currentTrackIndex++;
        if (currentTrackIndex < tracks.length) {
            playTrack(tracks[currentTrackIndex]);
        } else {
            gameDiv.innerHTML = '<p>Game over! You’ve guessed all the tracks.</p>';
        }
    };
};

// Listen for Search Input
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
