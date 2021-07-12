import { PlayIcon, PlusSmIcon, CheckIcon } from "@heroicons/react/solid";
import { fetchMovieVideo } from "api/movies";
import Link from "components/link";
import { useMoviesCtx } from "context/movies";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "styles/movie-details.module.css";
import { fetchPoster } from "api/movies";
import { Actions, useWatchListCtx } from "context/watchlist";

export default function Home() {
  const { id } = useParams();
  const [thumb, setThumb] = useState({
    src: "https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1280_.jpg",
    srcSet: "",
  });
  const { movies, setMovies } = useMoviesCtx();
  const [videos, setVideos] = useState(null);
  const { watchListData, setWatchListData } = useWatchListCtx();

  const movie = movies.find((m) => String(m.id) === String(id));

  const isInWatchList = !!watchListData.find((movieId) => movieId === id);

  useEffect(() => {
    fetchMovieVideo({ movieId: id }).then(setVideos);
  }, [id, setMovies]);

  return (
    <>
      <main className={styles.wrapper}>
        <span className={styles.heroBlur}></span>
        <img
          key={thumb.src}
          className={styles.heroThumb}
          src={thumb.src}
          srcSet={thumb.srcSet}
          layout="fill"
          alt=""
        />

        <div className={styles.ctaWrapper}>
          {/* Watch Now Button */}
          <Link
            className={`${styles.ctaBtn} ${styles.watchBtn}`}
            href={`/movie/${id}/episodes`}
          >
            <PlayIcon className={`${styles.ctaIcon} ${styles.watchBtnIcon}`} />
            Watch Now
          </Link>

          {isInWatchList ? (
            <button
              className={`${styles.ctaBtn} ${styles.watchListBtn}`}
              onClick={() => Actions.AddMovie(setWatchListData, id)}
            >
              <CheckIcon className={styles.ctaIcon} />
              In WatchList
            </button>
          ) : (
            /* Add To WishList Button */
            <button
              className={`${styles.ctaBtn} ${styles.watchListBtn}`}
              onClick={() => Actions.AddMovie(setWatchListData, id)}
            >
              <PlusSmIcon
                className={`${styles.ctaIcon} ${styles.watchListIcon}`}
              />
              Add to WatchList
            </button>
          )}
        </div>

        <div className={styles.zIndex10}>
          {/* Title */}
          <h1 className={styles.title}>
            {movie.original_title.split(" ").map((subTitle) => (
              <>
                {subTitle}
                <br />
              </>
            ))}
          </h1>

          <section className={styles.detailsWrapper}>
            <div className={styles.detailsFlex}>
              {/* Empty Gap */}
              <span className={styles.detailsTitle}></span>

              {/* Date | Genre */}
              <small>{movie.release_date}</small>
              <span className={styles.pipeEntity}></span>
              <small>Fantasy, Drama</small>
            </div>

            <div className={styles.detailsFlex}>
              <span className={styles.detailsTitle}>The Story</span>
              <p>
                {movie.overview}
                <Link
                  href={`/movies/${id}/episodes`}
                  className={styles.readMore}
                >
                  Read More &rarr;
                </Link>
              </p>
            </div>

            <div className={styles.detailsFlex}>
              <span className={styles.detailsTitle}>Trailers</span>

              {/* Trailers images */}
              <div className={styles.trailerThumbWrapper}>
                {(() => {
                  switch (true) {
                    case videos?.length === 0: {
                      return Array.from({ length: 3 }, () => (
                        <img
                          className={styles.trailerThumb}
                          src="#"
                          width={160}
                          height={100}
                          alt=""
                        />
                      ));
                    }

                    case videos?.length > 0: {
                      return videos.map((youtubeMeta) => (
                        <img
                          className={styles.trailerThumb}
                          src={fetchPoster(youtubeMeta.key, "maxres")}
                          width={160}
                          height={100}
                          alt="the witcher 2019 trailer 1"
                          onMouseEnter={(ev) =>
                            setThumb({
                              src: ev.target.src,
                              srcSet: ev.target.srcset,
                            })
                          }
                        />
                      ));
                    }

                    default:
                      return <p>Didn't got any trailers from TV to show</p>;
                  }
                })()}
              </div>
            </div>
          </section>
        </div>
        <footer className={styles.footer}>
          <Link href="#" className={styles.footerLink}>
            Privacy
          </Link>
          <Link href="#" className={styles.footerLink}>
            Settings
          </Link>
          <Link href="#" className={styles.footerLink}>
            Credits
          </Link>
        </footer>
      </main>
    </>
  );
}
