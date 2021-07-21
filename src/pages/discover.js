import { fetchGenres } from "api/genres";
import { fetchDiscoverMovies } from "api/movies";
import Chip from "components/chip";
import Link from "components/link";
import { useMoviesCtx } from "context/movies";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styles from "styles/discover.module.css";
import MovieItem from "components/movie-item";
import homeS from "styles/home.module.css";
import { clsx } from "js/clsx";

const defaultFilters = {
  sortBy: "popularity.desc",
};

export default function Discover() {
  const location = useLocation();
  const history = useHistory();
  const [genres, setGenres] = useState(null);
  const [discover, setDiscover] = useState(null);
  const { setMovies } = useMoviesCtx();

  const filters = {
    ...defaultFilters,
    ...searchToParams(location.search),
  };

  useEffect(() => {
    fetchGenres()
      .then((_genres) => (_genres == null ? [] : _genres))
      .then(setGenres);
  }, []);

  useEffect(() => {
    fetchDiscoverMovies({ sortBy: filters.sortBy, genre: filters.genre }).then(
      (discoverdMovies) => {
        setDiscover(discoverdMovies);
        setMovies(discoverdMovies);
      }
    );
  }, [filters.genre, filters.sortBy, setMovies]);

  function handleSearch(newFilters) {
    const params = new URLSearchParams({
      ...filters,
      ...newFilters,
    });

    history.push("/discover?" + params.toString());
  }

  return (
    <div style={{ background: "var(--main)", minHeight: "100vh" }}>
      {/* Top Filter Bar Wrapper */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Movies</h1>

        {/* Sort By */}
        <select
          className={styles.sortBy}
          onChange={(ev) => handleSearch({ sortBy: ev.target.value })}
        >
          {[
            ["Popularity", "popularity.desc"],
            ["Release Date", "release_date.desc"],
            ["Rating", "vote_average.desc"],
            ["Vote Counts", "vote_count.desc"],
          ].map(([optName, optValue]) => (
            <option value={optValue} selected={filters.sortBy === optValue}>
              {optName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.genreList}>
        {(() => {
          switch (true) {
            // Loading Screen
            case genres == null:
              return Array.from({ length: 3 }).map(() => (
                <Chip> &nbsp; &nbsp; &nbsp; &nbsp;</Chip>
              ));

            // Render Genre Chips
            case genres.length > 0:
              return genres.map(({ id, name }) => (
                <span
                  onClick={() =>
                    handleSearch({
                      genre: id,
                    })
                  }
                >
                  <Chip
                    color={
                      filters.genre === String(id)
                        ? "var(--o-accent)"
                        : "var(--o-muted)"
                    }
                    key={id}
                  >
                    {name}
                  </Chip>{" "}
                </span>
              ));

            // Error State
            default:
              return <p>Something went wrong</p>;
          }
        })()}
      </div>

      <ul className={clsx(homeS.movieGrid, styles.movieGrid)}>
        {(() => {
          switch (true) {
            // Loading Screen
            case discover == null:
              return Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx}>
                  <img src="#" alt="" />
                </li>
              ));

            // Render Movie Poster
            case discover.length > 0:
              return discover.map(
                ({ id, poster_path, release_date, vote_average, title }) => (
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
              );

            // Error State
            default:
              return <li>Something went wrong</li>;
          }
        })()}
      </ul>
    </div>
  );
}

function searchToParams(url) {
  const params = new URLSearchParams(url ?? "");
  return Object.fromEntries(params.entries());
}
