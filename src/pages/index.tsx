import React, { useState, useEffect } from 'react';
import Link from 'components/link';
import styles from 'styles/home.module.css';
import { fetchDiscoverMovies, fetchTrendingMovies } from 'api/movies';
import MovieItem from 'components/movie-item';
import { ArrowDownIcon } from '@heroicons/react/solid';

interface HomeProps {
  movies: any[];
  trendingMovies: any[];
}

export default function Home({ trendingMovies, movies: moviesInit }: HomeProps) {
  const [page, setPage] = useState(2);
  const [movies, setMovies] = useState<any[]>(moviesInit);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/discover?page=1&genre=')
      .then((r) => r.json())
      .then((data) => setMovies((prev) => [...prev, ...data.results]))
      .catch(() => setError('Error'));
  }, [page, setMovies]);

  return (
    <div>
      <h1 className={styles.sectionTitle}>Discover</h1>
      {/* Discover */}
      <ul className={styles.movieGrid}>
        {movies.map(({ release_date, title, poster_path, vote_average, id }) => (
          <li key={id}>
            <Link href={`/movie/${id}/details`}>
              <a>
                <MovieItem
                  posterPath={poster_path}
                  title={title}
                  voteRating={vote_average}
                  releaseDate={release_date}
                />
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <button className={styles.loadMoreBtn} onClick={() => setPage((l) => ++l)}>
          Load More <ArrowDownIcon width="1rem" />
        </button>
      </div>

      <h1 className={styles.sectionTitle}>Trending</h1>

      {/* Treding Movies */}
      <ul className={styles.movieGrid}>
        {/* Conditional Rendering using switch statement :)) */}
        {trendingMovies.map(({ release_date, title, poster_path, vote_average, id }) => (
          <Link key={id} href={`/movie/${id}/details`}>
            <MovieItem
              posterPath={poster_path}
              title={title}
              voteRating={vote_average}
              releaseDate={release_date}
            />
          </Link>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  let props: HomeProps = {} as any;

  await Promise.all([fetchDiscoverMovies({ page: 1 }), fetchTrendingMovies()]).then(
    ([movies, trendingMovies]) => {
      props.movies = movies.results;
      props.trendingMovies = trendingMovies;
    }
  );

  return { props };
}
