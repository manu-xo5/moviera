import { CheckIcon, PlayIcon, PlusSmIcon } from "@heroicons/react/solid";
import { fetchMovieVideo, fetchPoster } from "api/movies";
import Link from "components/link";
import Player from "components/player";
import { useMoviesCtx } from "context/movies";
import { Actions, useWatchListCtx } from "context/watchlist";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "styles/movie-details.module.css";

const initialThumb = {
  src: "https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1280_.jpg",
  srcSet: "",
};

export default function Home() {
  const { id } = useParams();
  const [thumb, setThumb] = useState(initialThumb);
  const { movies } = useMoviesCtx();
  const [videos, setVideos] = useState(null);
  const { watchListData, setWatchListData } = useWatchListCtx();
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  const movie = movies.find((m) => String(m.id) === String(id));
  const isInWatchList = !!watchListData.find((movieId) => movieId === id);

  useEffect(() => {
    fetchMovieVideo({ movieId: id }).then(setVideos);
  }, [id]);

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
          <button
            className={`${styles.ctaBtn} ${styles.watchBtn}`}
            onClick={() => setShowPlayer(true)}
          >
            <PlayIcon className={`${styles.ctaIcon} ${styles.watchBtnIcon}`} />
            Watch Now
          </button>

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

          {/* Movie Info Wrapper */}
          <section className={styles.detailsWrapper}>
            <div className={styles.detailsFlex}>
              {/* Empty Gap */}
              <span className={styles.detailsTitle}></span>

              {/* Date | Genre */}
              <small>{movie.release_date}</small>
              <span className={styles.pipeEntity}></span>
              <small>Fantasy, Drama</small>
            </div>

            {/* Dynamic  Video Player */}
            {showPlayer && (
              <Player
                videos={videos}
                onClose={() => setShowPlayer(false)}
                setSelectedVideoIdx={setSelectedVideoIdx}
                selectedVideoIdx={selectedVideoIdx}
              />
            )}

            {/* Trailers images */}
            <div className={styles.detailsFlex}>
              <span className={styles.detailsTitle}>Trailers</span>

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
                      return videos.map((youtubeMeta, i) => (
                        <img
                          className={styles.trailerThumb}
                          src={fetchPoster(youtubeMeta.key, "maxres")}
                          width={160}
                          height={100}
                          alt="the witcher 2019 trailer 1"
                          onClick={() => {
                            setShowPlayer(true);
                            setSelectedVideoIdx(i);
                          }}
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
