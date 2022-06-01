import { fetchMovieVideo, fetchPoster } from 'api/movies';
import { useMoviesCtx } from 'context/movies';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import s from 'styles/episodes.module.css';

const fetchYoutubeFrame = (youtubeKey) => `https://www.youtube.com/embed/${youtubeKey}`;

export default function MovieEpisodes() {
  const { id } = useRouter().query;
  const [videos, setVideos] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState('');
  // const { movies } = useMoviesCtx();

  // const movie = movies.find((m) => m.id == id);

  useEffect(() => {
    fetch(`/api/movie/${id}/video`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.results) return;

        let videos = data.results;
        setVideos(videos);
        setSelectedVideo(videos[0].key);
      });
  }, [id]);

  return (
    <div className={s.container}>
      <div
        style={{
          position: 'sticky',
          top: 0,
        }}
      >
        {selectedVideo !== '' ? (
          <iframe
            className={s.player}
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
      </div>

      <article>
        {(() => {
          switch (true) {
            // Videos data is loading
            case videos === null: {
              return Array(3)
                .fill(0)
                .map((_, i) => (
                  <img src="#" width="450px" height="300px" alt={`trailer ${i} loading`} />
                ));
            }

            // Videos Data has atleast 1 video
            case videos.length > 0: {
              return videos.map((youtubeMeta, i) => (
                <div
                  className={
                    (selectedVideo === youtubeMeta.key ? s.selectedVideo : '') + ' ' + s.video
                  }
                >
                  {selectedVideo === youtubeMeta.key && (
                    <span className={s.selectedVideoPlaySymbol}>Playing</span>
                  )}
                  <img
                    src={fetchPoster(youtubeMeta.key, 'sd')}
                    width="450px"
                    height="300px"
                    alt={`trailer ${i} loading`}
                    onClick={() => setSelectedVideo(youtubeMeta.key)}
                  />
                </div>
              ));
            }

            // VideosData has no item Or Maybe a Error
            default: {
              return <p>Didn't got any trailer/teaser to show</p>;
            }
          }
        })()}
      </article>
    </div>
  );
}
