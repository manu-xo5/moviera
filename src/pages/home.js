import React, { useState, useEffect } from "react";
import Link from "components/link";
import styles from "styles/home.module.css";
import { useMoviesCtx } from "context/movies";
import { fetchDiscoverMovies, fetchTrendingMovies } from "api/movies";
import MovieItem from "components/movie-item";

export default function Home() {
  const [page, setPage] = useState(1);
  const [trendingMovies, setTrendingMovies] = useState(null);
  const { movies, setMovies } = useMoviesCtx();

  useEffect(() => {
    fetchDiscoverMovies({ page })
      .then((movies) => setMovies((prev) => [...prev, ...movies]))
      .catch(() => setMovies(["Error"]));

    fetchTrendingMovies()
      // check if got something good from server
      .then((trending) => (trending == null ? [] : trending))
      .then(setTrendingMovies)
      // we change state from `null -> []`
      // so we know that loading is done now
      .catch((_) => setTrendingMovies([]));
  }, [page, setMovies]);

  return (
    <div>
      <h1 style={{ fontSize: 64 }}>Discover</h1>
      {/* Discover */}
      <ul className={styles.movieGrid}>
        {movies.map(
          ({ release_date, title, poster_path, vote_average, id }) => (
            <li key={id}>
              <Link href={`/movie/${id}/details`}>
                <MovieItem
                  posterPath={poster_path}
                  title={title}
                  voteRating={vote_average}
                  releaseDate={release_date}
                />
              </Link>
            </li>
          )
        )}
      </ul>

      <h1 style={{ fontSize: 64 }}>Trending</h1>

      {/* Treding Movies */}
      <section className={styles.movieGrid}>
        {/* Conditional Rendering using switch statement :)) */}
        {(() => {
          switch (true) {
            case trendingMovies === null: {
              // show a placeholder IMG without any content when loading
              return Array(3)
                .fill(0)
                .map(() => (
                  <div>
                    <img
                      className={styles.poster}
                      src="#"
                      alt=""
                      width="300px"
                      height="450px"
                    />
                  </div>
                ));
            }

            case trendingMovies.length > 0: {
              return trendingMovies.map((movie) => (
                <Link key={movie.id} href={`/movie/${movie.id}/details`}>
                  <div>
                    <img
                      className={styles.poster}
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={`${movie.original_title} poster`}
                    />
                    <p>{movie.original_title}</p>
                    <p>
                      <small>Released on: {movie.release_date}</small>
                    </p>
                    <p>
                      <small>Rating: {movie.vote_average}</small>
                    </p>
                  </div>
                </Link>
              ));
            }

            default: {
              return <p>No Trending Video Got to show you.</p>;
            }
          }
        })()}
      </section>

      <button onClick={() => setPage((l) => ++l)}>Load More ({page})</button>
    </div>
  );
}
