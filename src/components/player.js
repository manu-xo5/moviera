import {
  FastForwardIcon,
  RewindIcon,
  StarIcon as LinedStarIcon,
} from "@heroicons/react/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/solid";
import { Actions, useWatchListCtx } from "context/watchlist";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import playerS from "styles/player.module.css";

export default function Player({
  videos,
  onClose,
  selectedVideoIdx,
  setSelectedVideoIdx,
}) {
  const { watchListData, setWatchListData } = useWatchListCtx();
  const { id } = useParams();

  const isInWatchList = !!watchListData.find((movieId) => movieId === id);

  useEffect(() => {
    const handleEscKey = (ev) => {
      if (ev.code === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  return (
    videos && (
      <div className={playerS.wrapper}>
        <div className={playerS.backdrop} onClick={onClose}></div>

        <iframe
          className={playerS.player}
          src={fetchYoutubeFrame(videos[selectedVideoIdx].key)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Controls Wrapper */}
        <div className={playerS.controlWrapper}>
          {/* Add to List Btn */}
          <button
            className={`${playerS.controlBtn} ${
              isInWatchList && playerS.controlActive
            }`}
            onClick={() => {
              console.log(watchListData);
              isInWatchList
                ? Actions.RemoveMovie(setWatchListData, id)
                : Actions.AddMovie(setWatchListData, id);
            }}
          >
            {isInWatchList ? (
              <SolidStarIcon style={{ width: "1rem" }} />
            ) : (
              <LinedStarIcon style={{ width: "1rem" }} />
            )}
            Add to WatchList
          </button>

          <button
            className={playerS.controlBtn}
            onClick={() => setSelectedVideoIdx(changeIdx(videos.length, -1))}
          >
            <RewindIcon />
            Prev
          </button>

          <button
            className={playerS.controlBtn}
            onClick={() => setSelectedVideoIdx(changeIdx(videos.length, +1))}
          >
            Next
            <FastForwardIcon />
          </button>
        </div>
      </div>
    )
  );
}

function changeIdx(arrayLength, steps) {
  return (prev) => {
    let desiredIdx = prev + steps;

    if (desiredIdx < 0) desiredIdx = 0;

    if (desiredIdx > arrayLength - 1) desiredIdx = arrayLength - 1;

    return desiredIdx;
  };
}

function fetchYoutubeFrame(youtubeKey) {
  return `https://www.youtube.com/embed/${youtubeKey}`;
}
