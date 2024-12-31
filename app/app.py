from flask import Flask, request, render_template, jsonify
from spotifyapi import search_artists, get_artist_top_tracks
import random
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    artists = search_artists(query)
    return jsonify(artists)

@app.route('/artist/<artist_id>/top-tracks', methods=['GET'])
def top_tracks(artist_id):
    tracks = get_artist_top_tracks(artist_id)
    results = [
        {
            "name": track["name"],
            "preview_url": track["preview_url"],  # Snippet of the song
            "album": track["album"]["name"],
            "image": track["album"]["images"][0]["url"] if track["album"]["images"] else None
        }
        for track in tracks if track["preview_url"]  # Only include tracks with a preview
    ]
    random.shuffle(results)
    return jsonify(results)
    

if __name__ == '__main__':
    app.run(debug=True, port=5001)