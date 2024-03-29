const TMDB_API_KEY = process.env.TMDB_KEY;

/**
 * return a list of movies based on params object
 * @param {{ page: number }} param0
 * @returns { Promise<any> }
 */
export async function fetchDiscoverMovies({
  page = 1,
  sortBy = "popularity.desc",
  genre,
}) {
  const filters = {
    api_key: TMDB_API_KEY,
    page: page,
    sort_by: sortBy,
  };
  if (genre) filters.with_genres = genre;

  const params = new URLSearchParams({
    language: "en-US",
    include_adult: false,
    ...filters,
  });

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
  );


  const jsonData = await res.json();
  console.log(jsonData)

  if (!res.ok) return null;
  return jsonData
}

/**
 * get a array of movies list by movieId
 * @param {{ movieId: number }} param0
 * @returns { Promise<any[]> }
 */
export async function fetchMovieVideo({ movieId }) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
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

/**
 * search movie by fuzzy title i.e. query
 * @param {{ page: number | string, language: string[], query: string }} param0
 */
export async function fetchSearchMovies({ page, language, query }) {
  const params = new URLSearchParams({
    page: page,
    language: language.join(", "),
    api_key: TMDB_API_KEY,
    include_adult: false,
    query: encodeURI(query.replace(/\s/g, "-")),
  });

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?${params.toString()}`
  );

  if (!res.ok) return null;

  const jsonData = await res.json();
  return jsonData.results;
}


export default function handler(_,res) {
  return res.status(200)
}