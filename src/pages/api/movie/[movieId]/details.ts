import { NextApiRequest, NextApiResponse } from "next";
const TMDB_API_KEY = process.env.TMDB_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.movieId.toString();

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?` +
      `api_key=${TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();

  if (!response.ok) return null;

  res.json(data);
}
