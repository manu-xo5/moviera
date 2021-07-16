const TMDB_API_KEY = process.env.REACT_APP_TMDB_KEY;

export async function fetchGenres() {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
  });

  const res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?" + params.toString()
  );

  if (!res.ok) return null;

  const jsonData = await res.json();

  return jsonData.genres;
}
