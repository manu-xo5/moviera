import React, { useEffect, useReducer, useState } from "react";
import { fetchSearchMovies } from "api/movies";
import Link from "components/link";
import { useMoviesCtx } from "context/movies";
import styles from "styles/search.module.css";
import Dropdown from "components/dropdown";
import { clsx } from "js/clsx";
import MovieItem from "components/movie-item";

const langs = [
  ["English (IN)", "en-IN"],
  ["English (US)", "en-US"],
];
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
          {langs.map(([languageName, languageValue]) => (
            <label key={languageName} className={styles.languageOption}>
              <input
                value={languageValue}
                name="language"
                id="language"
                type="checkbox"
                defaultChecked={filters.language.includes(languageValue)}
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
                    <MovieItem
                      posterPath={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      releaseDate={movie.release_date}
                      title={movie.original_title}
                      voteRating={movie.vote_average}
                    />
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
      {searchData?.length > 0 && (
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
