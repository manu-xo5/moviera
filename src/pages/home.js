import React, { useState, useEffect } from "react";
import Link from "components/link";
import styles from "styles/home.module.css";
import { useMoviesCtx } from "context/movies";
import { fetchDiscoverMovies } from "api/movies";

export default function Home() {
  const [page, setPage] = useState(1);
  const { movies, setMovies } = useMoviesCtx();

  useEffect(() => {
    fetchDiscoverMovies({ page })
      .then((movies) => setMovies((prev) => [...prev, ...movies]))
      .catch(() => setMovies(["Error"]));
  }, [page, setMovies]);

  return (
    <div>
      <section className={styles.movieGrid}>
        {movies.map(
          ({ original_title, release_date, poster_path, vote_average, id }) => (
            <Link href={`/movie/${id}/details`}>
              <div key={original_title}>
                <img
                  className={styles.poster}
                  src={`https://image.tmdb.org/t/p/w300${poster_path}`}
                  alt={`${original_title} poster`}
                />
                <p>{original_title}</p>
                <p>
                  <small>Released on: {release_date}</small>
                </p>
                <p>
                  <small>Rating: {vote_average}</small>
                </p>
              </div>
            </Link>
          )
        )}
      </section>
      <button onClick={() => setPage((l) => ++l)}>Load More ({page})</button>
    </div>
  );
}
