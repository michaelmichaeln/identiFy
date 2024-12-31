# identiFy

⚠️ Warning: The `.env` file contains temporary credentials for demonstration purposes.
Do not misuse these credentials. If you plan to deploy this project or use it extensively,
generate your own Spotify API keys

Spotify Snippet Guessing Game 🎵
A web-based guessing game where users search for an artist, listen to snippets of their top tracks, and guess the song titles.

Features
Search Artists: Find artists via an autocomplete search bar.
Randomized Snippets: Top tracks of the selected artist are shuffled for each game.
Interactive Gameplay: Listen to a track snippet, guess the title, and receive instant feedback.
Score Tracking: Displays the final score after all tracks are played.
Technologies
Backend: Flask, Spotipy, dotenv
Frontend: HTML, CSS, JavaScript


Setup Instructions:
1. Clone Repositiory : 
    git clone https://github.com/michaelmichaeln/identiFy.git
    cd identiFy
2. Install Dependencies :
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
3. python app/app.py :