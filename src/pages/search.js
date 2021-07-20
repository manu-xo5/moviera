import React, { useEffect, useReducer, useState } from "react";
import { fetchSearchMovies } from "api/movies";
import Link from "components/link";
import { useMoviesCtx } from "context/movies";
import styles from "styles/search.module.css";
import Dropdown from "components/dropdown";
import { clsx } from "js/clsx";

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
    if (!filters.query) return;

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
      <h1 className={styles.title}>
        Find <span className="font-bold">Perfect</span> movie for the evening
      </h1>

      <form onSubmit={handleSearch} className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          placeholder="movie name"
          name="query"
        />

        <Dropdown label={<p className={styles.languageLabel}>Language</p>}>
          {langs.map((languageName) => (
            <label key={languageName} className={styles.languageOption}>
              <input
                value={languageName}
                name="language"
                id="language"
                type="checkbox"
                defaultChecked={filters.language.includes(languageName)}
              />
              {languageName}
            </label>
          ))}
        </Dropdown>

        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>

      <ul className={styles.movieGrid}>
        {(() => {
          switch (true) {
            case searchData == null: {
              return Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className={styles.movieGridItem}>
                    <img className={styles.moviePoster} src="#" alt="" />
                  </div>
                ));
            }

            case searchData.length > 0: {
              return searchData.map((movie) => (
                <li key={movie.id}>
                  <Link
                    href={`/movie/${movie.id}/details`}
                    className={styles.movieGridItem}
                  >
                    <img
                      className={styles.moviePoster}
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`${movie.original_title} poster`}
                      loading="lazy"
                    />
                    <p>{movie.original_title}</p>
                    <p>
                      <small>Released on: {movie.release_date}</small>
                    </p>
                    <p>
                      <small>Rating: {movie.vote_average}</small>
                    </p>
                  </Link>
                </li>
              ));
            }

            default:
              return (
                <p className={clsx("text-center", styles.error)}>
                  ..** Nothing matched to your query. try different spelling
                  maybe. **..
                </p>
              );
          }
        })()}
      </ul>

      {/* Page Controls */}
      {searchData != null && (
        <div className={styles.pageControlWrapper}>
          <button
            className={styles.pageControlBtn}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            type="button"
            disabled={filters.page === 1}
          >
            Prev
          </button>

          <span>{filters.page}</span>

          <button
            className={styles.pageControlBtn}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            type="button"
            disabled={!hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
