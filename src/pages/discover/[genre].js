import { fetchGenres } from 'api/genres';
import { fetchDiscoverMovies } from 'api/movies';
import Chip from 'components/chip';
import Link from 'components/link';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';
import styles from 'styles/discover.module.css';
import MovieItem from 'components/movie-item';
import homeS from 'styles/home.module.css';
import { clsx } from 'js/clsx';
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/outline"

const defaultFilters = {
  sortBy: 'popularity.desc',
  page: 1,
};

export default function Discover({ genres, selectedGenre }) {
  const router = useRouter();
  const { query, pathname: location } = router;

  let [totalPages, setTotalPages] = React.useState(0);
  const [discover, setDiscover] = useState(null);

  const filters = {
    ...defaultFilters,
    ...searchToParams(query),
  };

  useEffect(() => {
    const params = new URLSearchParams({
      sortBy: filters.sortBy,
      genre: filters.genre,
      page: filters.page,
    });

    fetch('/api/discover?' + params.toString())
      .then((r) => r.json())
      .then((data) => {
        setTotalPages(data.totalPages);
        setDiscover(data.results);
      });
  }, [filters.genre, filters.page, filters.sortBy]);

  function handleSearch(newFilters) {
    const params = new URLSearchParams({
      ...filters,
      ...newFilters,
    });

    router.push(`/discover/${newFilters.genre}?` + params.toString());
  }

  return (
    <div style={{ background: 'var(--main)', minHeight: '100vh' }}>
      {/* Top Filter Bar Wrapper */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Movies</h1>

        {/* Sort By */}
        <select
          className={styles.sortBy}
          onChange={(ev) => handleSearch({ sortBy: ev.target.value })}
        >
          {[
            ['Popularity', 'popularity.desc'],
            ['Release Date', 'release_date.desc'],
            ['Rating', 'vote_average.desc'],
            ['Vote Counts', 'vote_count.desc'],
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
              return Array.from({ length: 3 }).map(() => <Chip> &nbsp; &nbsp; &nbsp; &nbsp;</Chip>);

            // Render Genre Chips
            case genres.length > 0:
              return genres.map(({ id, name }) => (
                <span
                  onClick={() =>
                    handleSearch({
                      genre: id,
                      page: 1,
                    })
                  }
                >
                  <Chip
                    color={filters.genre === String(id) ? 'var(--o-accent)' : 'var(--o-muted)'}
                    key={id}
                  >
                    {name}
                  </Chip>{' '}
                </span>
              ));

            // Error State
            default:
              return <p>Something went wrong</p>;
          }
        })()}
      </div>

      <ul className={clsx(styles.movieGrid, homeS.movieGrid)}>
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
              return discover.map(({ id, poster_path, release_date, vote_average, title }) => (
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
              ));

            // Error State
            default:
              return <li>Something went wrong</li>;
          }
        })()}
      </ul>

      <div className={styles.paginationContainer}>
        <Link
          className={clsx(
             filters.pages === 1 && styles.disableButton,
            styles.paginationBtn
          )}

          href={`/discover/${filters.genre}?${new URLSearchParams({
            ...filters,
            page: Math.max(filters.page - 1, 1),
          }).toString()}`}
        >
          
          <ArrowLeftIcon width="1rem" />
          Prev
        </Link>

        <span className={styles.paginationNumber}>{filters.page} of {totalPages}</span>

        <Link
          className={clsx(
            totalPages === filters.pages && styles.disableButton,
            styles.paginationBtn
          )}

          href={`/discover/${filters.genre}?${new URLSearchParams({
            ...filters,
            page: Math.min(+filters.page + 1, totalPages),
          }).toString()}`}
        >
          Next
          <ArrowRightIcon  width="1rem" />
        </Link>
      </div>
    </div>
  );
}

function searchToParams(url) {
  const params = new URLSearchParams(url ?? '');
  return Object.fromEntries(params.entries());
}

export async function getServerSideProps(req) {
  const TMDB_API_KEY = process.env.TMDB_KEY;
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
  });
  const genre = req.query.genre.toString();

  const response = await fetch(
    'https://api.themoviedb.org/3/genre/movie/list?' + params.toString()
  );
  const jsonData = await response.json();

  return { props: { genres: jsonData.genres, selectedGenre: genre } };
}
