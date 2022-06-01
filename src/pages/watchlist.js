import { Actions, useWatchListCtx } from "context/watchlist";
import MovieItem from "components/movie-item";
import { useMoviesCtx } from "context/movies";
import { useEffect } from "react";
// import { fetchMovie } from "api/movies";
import homeS from "styles/home.module.css";
import { MinusIcon } from "@heroicons/react/solid";
import styles from "styles/watchlist.module.css";

export default function WatchList() {
  const { watchListData, setWatchListData } = useWatchListCtx();
  const { movies: moviesCache, setMovies } = useMoviesCtx();

  const movies = moviesCache.filter(({ id }) =>
    watchListData.includes(String(id))
  );

  function fetchMovie({id}) {
    return fetch(`/api/movie/${id}/details`).then(res => res.json());
  }

  useEffect(() => {
    (async () => {
      const watchMovies = await Promise.all(
        watchListData.map((id) => fetchMovie({ id }))
      );

      setMovies(watchMovies);
    })();
  }, [setMovies, watchListData]);



  return (
    <div>
      <h1 className={styles.title}>Watch List</h1>
      
      {(() => {
        switch (true) {
          case movies.length > 0:
            return (
              <ul className={homeS.movieGrid}>
                {movies.map(
                  ({ id, poster_path, vote_average, release_date, title }) => (
                    <li key={id} className={styles.movieItem}>
                      <MovieItem
                        posterPath={poster_path}
                        releaseDate={release_date}
                        title={title}
                        voteRating={vote_average}
                      />
                      <button
                        className={styles.removeBtn}
                        title="remove this movie from list"
                      >
                        <MinusIcon
                          width="1rem"
                          onClick={() =>
                            Actions.RemoveMovie(setWatchListData, String(id))
                          }
                        />
                      </button>
                    </li>
                  )
                )}
              </ul>
            );
          default:
            return (
              <p className={styles.error}>
                You don't have saved any movie on this machine
              </p>
            );
        }
      })()}
    </div>
  );
}
