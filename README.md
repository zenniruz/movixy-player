# Movixy Player

A standalone responsive video player server for Movixy. Pass any TMDB ID and get a fully-featured player with multiple provider fallback, quality selection, and subtitles.

## Player URL format

```
/player?tmdb={TMDB_ID}&type=movie&title=Movie+Name
/player?tmdb={TMDB_ID}&type=tv&s={season}&e={episode}&title=Show+Name
```

## Deploy to Vercel

1. Push this folder to a new GitHub repo
2. Import it at vercel.com/new
3. Add environment variable: `TMDB_API_KEY` = your TMDB API v3 key
4. Deploy — done

## Integrate with Movixy

In your Movixy frontend, replace the watch button link with:

```js
// Movie
const playerUrl = `https://your-player.vercel.app/player?tmdb=${movie.id}&type=movie&title=${encodeURIComponent(movie.title)}`;

// TV show
const playerUrl = `https://your-player.vercel.app/player?tmdb=${show.id}&type=tv&s=${season}&e=${episode}&title=${encodeURIComponent(show.name)}`;

// Open in new tab or navigate
window.open(playerUrl, "_blank");
```

## API endpoints

- `GET /api/info?tmdb=550&type=movie` — Returns TMDB metadata (poster, title, rating, overview)
- `GET /api/sources?tmdb=550&type=movie` — Returns all provider embed URLs

## Providers (tried in order)

1. AutoEmbed — best quality + built-in subtitle picker
2. VidSrc — wide library
3. VidLink — clean UI, themed to match Movixy
4. 2Embed — broad fallback
5. EmbedSu — additional fallback
6. VidSrc.me — final fallback

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `TMDB_API_KEY` | Yes | Your TMDB API v3 key (get free at themoviedb.org) |
