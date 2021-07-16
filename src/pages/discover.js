import { fetchGenres } from "api/genres";
import { fetchDiscoverMovies } from "api/movies";
import Link from "components/link";
import Chip from "components/chip";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useMoviesCtx } from "context/movies";

const defaultFilters = {
  sortBy: "popular",
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

  console.log(filters);

  return (
    <div style={{ background: "var(--main)", minHeight: "100vh" }}>
      {/* Top Filter Bar Wrapper */}
      <div>
        <h1>Movies</h1>

        {/* Sort By */}
        <select onChange={(ev) => handleSearch({ sortBy: ev.target.value })}>
          {/* popularity.desc, release_date.desc, vote_average.desc, vote_count.desc
           */}
          {[
            "popularity.desc",
            "release_date.desc",
            "vote_average.desc",
            "vote_count.desc",
          ].map((sortOpt) => (
            <option selected={filters.sortBy === sortOpt}>{sortOpt}</option>
          ))}
        </select>
      </div>

      <section>
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
      </section>

      <section>
        {(() => {
          switch (true) {
            // Loading Screen
            case discover == null:
              return Array.from({ length: 3 }).map((_, idx) => (
                <img key={idx} src="#" alt="" />
              ));

            // Render Movie Poster
            case discover.length > 0:
              return discover.map((movie) => (
                <Link href={`/movie/${movie.id}/details`}>
                  <img
                    key={movie.id}
                    style={{ minHeight: 450, minWidth: 300 }}
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={`${movie.original_title} poster`}
                  />
                </Link>
              ));

            // Error State
            default:
              return <p>Something went wrong</p>;
          }
        })()}
      </section>
    </div>
  );
}

function searchToParams(url) {
  const params = new URLSearchParams(url ?? "");
  return Object.fromEntries(params.entries());
}
