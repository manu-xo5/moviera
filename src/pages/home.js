import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import Link from "../components/link";
import { PlayIcon } from "@heroicons/react/solid";

export default function Home() {
  const [thumb, setThumb] = useState({
    src: "https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1280_.jpg",
    srcSet: "",
  });

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

        <div className={styles.zIndex10}>
          <h1 className={styles.title}>
            The <br /> Witcher
          </h1>

          <section className={styles.detailsWrapper}>
            <div className={styles.detailsFlex}>
              {/* Empty Gap */}
              <span className={styles.detailsTitle}></span>

              {/* Date | Genre */}
              <small>20 december 2019</small>
              <span className={styles.pipeEntity}></span>
              <small>Fantasy, Drama</small>
            </div>

            <div className={styles.detailsFlex}>
              <span className={styles.detailsTitle}>The Story</span>
              <p>
                Labore velit amet sunt sit occaecat dolore occaecat id deserunt
                ipsum. Non officia exercitation officia in nostrud minim commodo
                <Link
                  href={`/movie/${"the-witcher"}`}
                  className={styles.readMore}
                >
                  Read More &rarr;
                </Link>
              </p>
            </div>

            <div className={styles.detailsFlex}>
              <span className={styles.detailsTitle}>Trailers</span>

              <div className={styles.trailerThumbWrapper}>
                <img
                  className={styles.trailerThumb}
                  src="https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg"
                  srcSet="
                  https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX320_.jpg 320w,
                  https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX480_.jpg 480w,
                  https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX600_.jpg 600w,
                  https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1024_.jpg 1024w,
                  https://m.media-amazon.com/images/M/MV5BMTYyNzVhNTktZmIyMC00MDU1LWJmMjMtYmEzYmIyMDdjZTAwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1280_.jpg 1280w
                "
                  width={160}
                  height={100}
                  alt="the witcher 2019 trailer 1"
                  onMouseEnter={(ev) =>
                    setThumb({ src: ev.target.src, srcSet: ev.target.srcset })
                  }
                />

                <img
                  className={styles.trailerThumb}
                  src="https://m.media-amazon.com/images/M/MV5BZTFkYjU2NDgtZGQ1Yi00NjI2LWJhMjktYjdiNWJlNDBjOTE4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg"
                  srcSet="
                  https://m.media-amazon.com/images/M/MV5BZTFkYjU2NDgtZGQ1Yi00NjI2LWJhMjktYjdiNWJlNDBjOTE4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX320_.jpg 320w,
                  https://m.media-amazon.com/images/M/MV5BZTFkYjU2NDgtZGQ1Yi00NjI2LWJhMjktYjdiNWJlNDBjOTE4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX480_.jpg 480w,
                  https://m.media-amazon.com/images/M/MV5BZTFkYjU2NDgtZGQ1Yi00NjI2LWJhMjktYjdiNWJlNDBjOTE4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX600_.jpg 600w,
                  https://m.media-amazon.com/images/M/MV5BZTFkYjU2NDgtZGQ1Yi00NjI2LWJhMjktYjdiNWJlNDBjOTE4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1024_.jpg 1024w,
                  https://m.media-amazon.com/images/M/MV5BZTFkYjU2NDgtZGQ1Yi00NjI2LWJhMjktYjdiNWJlNDBjOTE4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1280_.jpg 1280w
                "
                  width={160}
                  height={100}
                  alt="the witcher 2019 trailer 1"
                  onMouseEnter={(ev) =>
                    setThumb({ src: ev.target.src, srcSet: ev.target.srcset })
                  }
                />
              </div>
            </div>
          </section>
        </div>

        <Link className={styles.watchBtn} href="#trailer">
          <PlayIcon className={styles.watchBtnIcon} />
          Watch Now
        </Link>

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
