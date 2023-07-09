import Dropdown from 'components/dropdown'
import Link from 'components/link'
import MovieItem from 'components/movie-item'
import { clsx } from 'js/clsx'
import React, { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from 'styles/search.module.css'
import { fetchSearchMovies } from 'api/movies'

const langs = [
  ['English (IN)', 'en-IN'],
  ['English (US)', 'en-US'],
]

export default function Search({ searchData: searchDataInit }) {
  const [searchData, setSearchData] = useState(searchDataInit?.results)
  const [filters, setFilters] = useState({ query: '', languages: [], page: 1 })

  const hasNextPage = searchData != null && searchData.length > 19

  async function handleSearch(ev: FormEvent<HTMLFormElement>) {
    ev?.preventDefault()

    const newFilters = {
      query: filters.query,
      language: filters.languages,
      page: filters.page,
    }

    await fetch('/api/search?' + new URLSearchParams(newFilters).toString())
      .then((r) => r.json())
      .then((r) => setSearchData(r.results))

    // await fetchSearchMovies(newFilters).then((r) => console.log({ r: r.results }))
  }

  console.log(filters)

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
          value={filters.query}
          onChange={(ev) => setFilters((prev) => ({ ...prev, query: ev.target.value }))}
        />

        <fieldset
          style={{ border: 'none', padding: 0, margin: 0 }}
          onChange={(ev) => {
            const langs = Array.from(ev.currentTarget.elements)
              .filter((input) => input.checked)
              .map((input) => input.value)
            setFilters((prev) => ({ ...prev, languages: langs }))
          }}
        >
          <Dropdown label={<p className={styles.languageLabel}>Language</p>}>
            {langs.map(([languageName, languageValue]) => (
              <label key={languageName} className={styles.languageOption}>
                <input value={languageValue} name="language" id="language" type="checkbox" />
                {languageName}
              </label>
            ))}
          </Dropdown>
        </fieldset>

        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>

      {searchData == null ? null : searchData.length > 0 ? (
        <ul className={styles.movieGrid}>
          {searchData.map((movie) => (
            <li key={movie.id}>
              <Link href={`/movie/${movie.id}/details`} className={styles.movieGridItem}>
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
        <p className={clsx('text-center', styles.error)}>
          ..** Nothing matched to your query. try different spelling maybe. **..
        </p>
      )}

      {/* Page Controls */}
      {searchData?.length > 0 && (
        <div className={styles.pageControlWrapper}>
          <button
            className={styles.pageControlBtn}
            onClick={() => {
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              handleSearch()
            }}
            type="button"
            disabled={filters.page === 1}
          >
            Prev
          </button>

          <span> Page No: {filters.page} </span>

          <button
            className={styles.pageControlBtn}
            onClick={() => {
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              handleSearch()
            }}
            type="button"
            disabled={!hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
