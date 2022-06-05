import { pluck } from 'js/object';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchDiscoverMovies } from '../../api/movies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const param = pluck({ page: Number, genre: String, sortBy: String }, req.query);

  const resu = await fetchDiscoverMovies(param);

  const { total_pages, results } = resu

  return res.json({
    totalPages: total_pages,
    results,
  });
}
