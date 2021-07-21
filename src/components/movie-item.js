import styles from "styles/movie-item.module.css";

/**
 *
 * @param {{
 *  title: string,
 *  posterPath: string,
 *  releaseDate: string,
 *  voteRating: number,
 *  }} param0
 * @returns
 */
export default function MovieItem({
  title,
  posterPath,
  releaseDate,
  voteRating,
}) {
  return (
    <div className={styles.wrapper}>
      <img
        className={styles.posterImg}
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={`${title} poster`}
        loading="lazy"
      />
      <div className={styles.details}>
        <p>{title}</p>
        <p>
          <small>Released on: {releaseDate}</small>
        </p>
        <p>
          <small>Rating: {voteRating}</small>
        </p>
      </div>
    </div>
  );
}
