import { CheckIcon, PlayIcon, PlusSmIcon } from '@heroicons/react/solid';
import Link from 'components/link';
import Player from 'components/player';
import Skeleton from 'components/skeleton';
import { Actions, useWatchListCtx } from 'context/watchlist';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from 'styles/movie-details.module.css';

/**
 *
 * @param {number | string} youtubeKey
 * @param {"sd" | "hq" | "maxres"} quality
 * @returns {string}
 */
export function fetchPoster(youtubeKey, quality = "sd") {
  return `https://i.ytimg.com/vi_webp/${youtubeKey}/${quality}default.webp`;
}

export default function Home({ videos, details: movie }) {
  const { id } = useRouter().query;
  const { watchListData, setWatchListData } = useWatchListCtx();
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  const [thumb, setThumb] = useState({
    src: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
  });
  
  const isInWatchList = !!watchListData.find((movieId) => movieId === id);

  return (
    <>
      <main className={styles.wrapper}>
        <span className={styles.heroBlur}></span>
        <img key={thumb.src} className={styles.heroThumb} src={thumb.src} layout="fill" alt="" />

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
              <PlusSmIcon className={`${styles.ctaIcon} ${styles.watchListIcon}`} />
              Add to WatchList
            </button>
          )}
        </div>

        <div className={styles.zIndex10}>
          {/* Title */}
          {movie == null ? (
            <>
              <Skeleton width="25rem" height="3rem" borderRadius="0.75rem" />
              <Skeleton display="block" width="10rem" height="3rem" borderRadius=".5rem" />
            </>
          ) : (
            <h1 className={styles.title}>{movie.original_title}</h1>
          )}

          {/* Movie Info Wrapper */}
          <section className={styles.detailsWrapper}>
            <div className={styles.detailsFlex}>
              {/* Empty Gap */}
              <span className={styles.detailsTitle}></span>

              {/* Date | Genre */}
              {movie == null ? (
                <Skeleton width="4rem" height="1rem" borderRadius=".2rem" />
              ) : (
                <small>{movie?.release_date}</small>
              )}
              <span className={styles.pipeEntity}></span>
              <small>Fantasy, Drama</small>
            </div>

            {/* Dynamic  Video Player */}
            {videos.length > 0 ? (
              <div className={showPlayer ? styles.playerShow : styles.playerHide}>
                <Player
                  key={showPlayer}
                  videos={videos}
                  onClose={() => setShowPlayer(false)}
                  setSelectedVideoIdx={setSelectedVideoIdx}
                  selectedVideoIdx={selectedVideoIdx}
                />
              </div>
            ) : null}

            {/* Trailers images */}
            <div className={styles.detailsFlex}>
              <span className={styles.detailsTitle}>Trailers</span>

              <div className={styles.trailerThumbWrapper}>
                {(() => {
                  switch (true) {
                    case videos?.length > 0: {
                      return videos.map((youtubeMeta, i) => (
                        <img
                          className={styles.trailerThumb}
                          src={fetchPoster(youtubeMeta.key, 'maxres')}
                          width={160}
                          height={100}
                          alt={youtubeMeta.name}
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
              {movie == null ? (
                <p style={{ minWidth: '80%' }}>
                  <Skeleton marginBottom={6} display="block" width="100%" height={16} />
                  <Skeleton marginBottom={6} display="block" width="95%" height={16} />
                  <Skeleton marginBottom={6} display="block" width="90%" height={16} />
                  <Skeleton marginBottom={6} display="block" width="100%" height={16} />
                  <Skeleton display="block" width="50%" height={16} />
                </p>
              ) : (
                <p>
                  {movie?.overview}
                  <Link href={`/movie/${id}/episodes`} className={styles.readMore}>
                    &nbsp; Read More &rarr;
                  </Link>
                </p>
              )}
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

export async function getServerSideProps(req) {
  let props = {};
  await Promise.all([
    fetch(`http://${process.env.DOMAIN}/api/movie/${req.query.id.toString()}/video`).then((r) => r.json()),
    fetch(`http://${process.env.DOMAIN}/api/movie/${req.query.id.toString()}/details`).then((r) =>
      r.json()
    ),
  ]).then(([videos, details]) => {
    props.videos = videos.results;
    props.details = details;
  });

  console.log(props);

  return { props };
}

const initialThumb = {
  src: 'https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1280_.jpg',
  srcSet: '',
};
