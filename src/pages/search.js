import React, { useEffect, useReducer, useState } from "react";
import { fetchSearchMovies } from "api/movies";
import Link from "components/link";
import { useMoviesCtx } from "context/movies";

const langs = ["en-IN", "en-US"];
const initialFilters = {
  page: 1,
  query: "",
  language: ["en-US"],
};

export default function Search() {
  const [searchData, setSearchData] = useState(null);
  const { setMovies } = useMoviesCtx();
  const [filters, setFilters] = useState(initialFilters);

  const hasNextPage = searchData != null && searchData.length > 19;

  function handleSearch(ev) {
    ev.preventDefault();
    console.log(ev.currentTarget);
    const query = ev.currentTarget.elements.query;
    const languageCheckboxes = ev.currentTarget.elements.language;

    const languages = Array.from(languageCheckboxes)
      .filter((langInput) => langInput.checked)
      .map((langInput) => langInput.value);

    setFilters({
      query: query.value,
      language: languages,
      page: 1,
    });
  }

  useEffect(() => {
    // check if search query is empty
    fetchSearchMovies(filters)
      .then((searchMovies) => (searchMovies == null ? [] : searchMovies))
      .then((searchMovies) => {
        setSearchData(searchMovies);
        setMovies((prev) => [...prev, ...searchMovies]);
      })
      .catch((_) => setSearchData([]));
  }, [filters, setMovies]);

  return (
    <div>
      <form onSubmit={handleSearch}>
        <fieldset>
          <legend>Language:</legend>

          <ul>
            {langs.map((languageName) => (
              <li key={languageName}>
                --{" "}
                <label>
                  {languageName}
                  <input
                    value={languageName}
                    name="language"
                    id="language"
                    type="checkbox"
                    defaultChecked={filters.language.includes(languageName)}
                  />
                </label>{" "}
                --
              </li>
            ))}
          </ul>
        </fieldset>

        <input placeholder="movie name" name="query" />
        <button>Search</button>
      </form>

      <hr />

      <button
        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
        type="button"
        disabled={filters.page === 1}
      >
        Prev
      </button>

      <span>{filters.page}</span>

      <button
        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
        type="button"
        disabled={!hasNextPage}
      >
        Next
      </button>

      <hr />

      <ul>
        {(() => {
          switch (true) {
            case searchData == null: {
              return Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <img src="#" alt="" width="300px" height="450px" />
                  </div>
                ));
            }

            case searchData.length > 0: {
              return searchData.map((movie) => (
                <li key={movie.id}>
                  <Link href={`/movie/${movie.id}/details`}>
                    <div>
                      <img
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
                </li>
              ));
            }

            default:
              return (
                <p>
                  ..** Nothing matched to your query. try different spelling
                  maybe. **..
                </p>
              );
          }
        })()}
      </ul>
    </div>
  );
}
