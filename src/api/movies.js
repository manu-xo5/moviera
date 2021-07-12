const TMDB_API_KEY = process.env.REACT_APP_TMDB_KEY;

/**
 * return a list of movies based on params object
 * @param {{ page: number }} param0
 * @returns { Promise<any[]> }
 */
export async function fetchDiscoverMovies({ page }) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page,
    language: "en-US",
    sort_by: "popularity.desc",
    include_adult: false,
    include_video: true,
    with_watch_monetization_types: "flatrate",
  });

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
  );

  const jsonData = await res.json();

  if (!res.ok) return null;
  return jsonData.results;
}

/**
 * get a array of movies list by movieId
 * @param {{ movieId: number }} param0
 * @returns { Promise<any[]> }
 */
export async function fetchMovieVideo({ movieId }) {
  const params = new URLSearchParams({
    api_key: "f33f352333249506564efbca4856444d",
    language: "en-US",
  });

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?${params.toString()}`
  );

  if (!res.ok) return null;

  const jsonData = await res.json();
  return jsonData.results;
}

/**
 *
 * @param {number | string} youtubeKey
 * @param {"sd" | "hq" | "maxres"} quality
 * @returns {string}
 */
export function fetchPoster(youtubeKey, quality = "sd") {
  return `https://i.ytimg.com/vi_webp/${youtubeKey}/${quality}default.webp`;
}

/**
 * get list of 20 trending movies
 * returns null on 400, 500 status code
 * @returns {Promise<any[]> | null}
 */
export async function fetchTrendingMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
  );

  if (!res.ok) return null;

  const jsonData = await res.json();
  return jsonData.results;
}

// TODO: search movie by text and filters
export async function fetchSearchMovies() {
  throw Error("Not implemented");
}
