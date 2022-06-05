import Dropdown from "components/dropdown";
import Link from "components/link";
import MovieItem from "components/movie-item";
import { clsx } from "js/clsx";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "styles/search.module.css";

const langs = [
  ["English (IN)", "en-IN"],
  ["English (US)", "en-US"],
];

const initialFilters = {
  page: 1,
  query: "",
  language: ["en-US"],
};

export default function Search({
  searchData: searchDataInit,
  filters: filtersInit,
}) {
  const [searchData, setSearchData] = useState(searchDataInit?.results);
  const [filters, setFilters] = useState(filtersInit);
  const router = useRouter();

  const hasNextPage = searchData != null && searchData.length > 19;

  function handleSearch(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    // console.log(ev.currentTarget);
    const query = ev.currentTarget.elements.namedItem(
      "query"
    ) as HTMLInputElement;

    const languagesInputElms = ev.currentTarget.elements.namedItem(
      "language"
    ) as Iterable<HTMLInputElement>;

    const languages = Array.from(languagesInputElms)
      .filter((langInput) => langInput.checked)
      .map((langInput) => langInput.value)
      .join(",");

    const newFilters = {
      query: query.value,
      language: languages,
      page: "1",
    };
    const params = new URLSearchParams(newFilters);

    router.push("/search?" + params.toString());

    setFilters(newFilters);
  }

  useEffect(() => {
    // check if search query is empty
    if (!filters.query) return;
    // check filter are initail so first render
    if (filters === filtersInit) return;

    const params = new URLSearchParams(filters);

    fetch("http://localhost:3000/api/search?" + params.toString())
      .then((r) => r.json())
      .then((data) => setSearchData(data.results));
  }, [filters, filtersInit]);

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
          defaultValue={filters.query}
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

      {searchData == null ? null : searchData.length > 0 ? (
        <ul className={styles.movieGrid}>
          {searchData.map((movie) => (
            <li key={movie.id}>
              <Link
                href={`/movie/${movie.id}/details`}
                className={styles.movieGridItem}
              >
                <a>
                  <MovieItem
                    posterPath={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    releaseDate={movie.release_date}
                    title={movie.original_title}
                    voteRating={movie.vote_average}
                  />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={clsx("text-center", styles.error)}>
          ..** Nothing matched to your query. try different spelling maybe. **..
        </p>
      )}

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

export async function getServerSideProps(req) {
  let props: any = {};
  const page = req.query.page?.toString() || initialFilters.page;
  const query = req.query.query?.toString() || initialFilters.query;
  const language = req.query.language?.toString() || initialFilters.language;

  props.filters = {
    page,
    query,
    language,
  };

  // if search is empty return;
  if (!query) return { props };

  const params = new URLSearchParams(props.filters);

  props.searchData = await fetch(
    "http://localhost:3000/api/search?" + params.toString()
  ).then((r) => r.json());

  return { props };
}
