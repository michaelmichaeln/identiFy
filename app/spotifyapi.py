
import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Spotify API credentials
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')

# Initialize Spotipy client
spotify = Spotify(auth_manager=SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
))

def search_artists(query, limit=10, min_popularity=50, country="US"):
    """
    Search for artists and filter results by quality (e.g., popularity, availability).

    Args:
        query (str): The search query for the artist.
        limit (int): Number of results to fetch from Spotify.
        min_popularity (int): Minimum popularity threshold for filtering.
        country (str): The country code to filter artists by availability.

    Returns:
        list: A list of high-quality artist objects.
    """
    try:
        # Search for artists using Spotify's /search endpoint
        results = spotify.search(q=f"artist:{query}", type="artist", limit=limit)
        artists = results['artists']['items']

        # Filter artists by quality: popularity, availability, and images
        filtered_artists = []
        for artist in artists:
            # Check popularity and image availability
            if artist["popularity"] >= min_popularity and artist["images"]:
                # Check if the artist has tracks available in the country
                top_tracks = spotify.artist_top_tracks(artist["id"], country=country)
                if top_tracks["tracks"]:  # Only include artists with tracks in the country
                    filtered_artists.append({
                        "id": artist["id"],
                        "name": artist["name"],
                        "popularity": artist["popularity"],
                        "image": artist["images"][0]["url"]  # Use the first image
                    })

        # Sort by popularity (descending) for better results
        filtered_artists.sort(key=lambda x: x["popularity"], reverse=True)
        return filtered_artists[:5]  # Return the top 5 results
    except Exception as e:
        print(f"Error searching for artists: {e}")
        return []


def get_artist_top_tracks(artist_id, country="US"):
    results = spotify.artist_top_tracks(artist_id, country=country)
    return results["tracks"]

def search_top_tracks(artist_id, country="US"):
    try:
        results = spotify.artist_top_tracks(artist_id, country=country)
        return [
            {
                "name": track["name"],
                "preview_url": track["preview_url"],
                "album": track["album"]["name"],
                "image": track["album"]["images"][0]["url"] if track["album"]["images"] else None
            }
            for track in results["tracks"] if track["preview_url"]
        ]
    except Exception as e:
        print(f"Error fetching top tracks: {e}")
        return []

