import { fetchMovieVideo, fetchPoster } from "api/movies";
import { useMoviesCtx } from "context/movies";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fetchYoutubeFrame = (youtubeKey) =>
  `https://www.youtube.com/embed/${youtubeKey}`;

export default function MovieEpisodes() {
  const { id } = useParams();
  const [videos, setVideos] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState("");
  // const { movies } = useMoviesCtx();

  // const movie = movies.find((m) => m.id == id);

  useEffect(() => {
    fetchMovieVideo({ movieId: id }).then((videos) => {
      setVideos(videos);
      setSelectedVideo(videos[0].key);
    });
  }, [id]);

  return (
    <>
      {selectedVideo !== "" ? (
        <iframe
          width="560"
          height="315"
          src={fetchYoutubeFrame(selectedVideo)}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      ) : (
        <video
          width="560"
          height="315"
          src="#"
          title="Loading Video Info..."
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></video>
      )}

      <article>
        {(() => {
          switch (true) {
            // Videos data is loading
            case videos === null: {
              return Array(3)
                .fill(0)
                .map((_, i) => (
                  <img
                    src="#"
                    width="450px"
                    height="300px"
                    alt={`trailer ${i} loading`}
                  />
                ));
            }

            // Videos Data has atleast 1 video
            case videos.length > 0: {
              return videos.map((youtubeMeta, i) => (
                <img
                  src={fetchPoster(youtubeMeta.key, "sd")}
                  width="450px"
                  height="300px"
                  alt={`trailer ${i} loading`}
                  onClick={() => setSelectedVideo(youtubeMeta.key)}
                />
              ));
            }

            // VideosData has no item Or Maybe a Error
            default: {
              return <p>Didn't got any trailer/teaser to show</p>;
            }
          }
        })()}
      </article>
    </>
  );
}
