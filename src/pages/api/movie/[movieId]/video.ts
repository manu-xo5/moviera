import { NextApiRequest, NextApiResponse } from "next";
const TMDB_API_KEY = process.env.TMDB_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
  });
  const movieId = req.query.movieId?.toString();
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?` +
        params.toString()
    );
    const jsonData = await response.json();
    res.json(jsonData);
  } catch (error: unknown) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
    res.status(400).json({ error: "Server Error" });
  }

  // res.json(await response.json());
}
