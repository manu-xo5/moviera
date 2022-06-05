import { NextApiRequest, NextApiResponse } from "next";
const TMDB_API_KEY = process.env.TMDB_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const page = req.query.page.toString();
    const language = req.query.language.toString();
    const query = req.query.query.toString();

    const params = new URLSearchParams({
      page,
      language,
      api_key: TMDB_API_KEY,
      // include_adult: "false",
      query: encodeURIComponent(query.replace(/\s/g, "-")),
    });

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?${params.toString()}`
    );

    if (!response.ok) throw Error("No Data");

    const jsonData = await response.json();
    console.log(jsonData);
    res.json(jsonData);
  } catch (error) {
    res.status(400);

    if (error instanceof Error) {
      res.json({ error: error.message });
    } else {
      res.json({ error: "server error" });
    }
  }
}
