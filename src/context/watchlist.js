const { createContext, useContext, useState, useEffect, default: React } = require('react');

/** @type {React.Context<{ watchListData: (number| string)[], setWatchListData: VoidFunction}>} */
const WatchListCtx = createContext();

export function WatchListProvider({ children }) {
  // array of selected movies' id
  const [watchListData, setWatchListData] = useState(null);

  // save when watchlist changes
  useEffect(() => {
    if (watchListData !== null) Actions.SaveWatchList(watchListData);
  }, [watchListData]);

  useEffect(() => {
    setWatchListData(Actions.LoadWatchList());
  }, []);
  
  /* outside world doesn't have to manage the null case, bcoz before watchlist was only array type -- not null -- no component was handling null case */
  let safe_watchListData = watchListData || [];

  return (
    <WatchListCtx.Provider
      value={{
        watchListData: safe_watchListData,
        setWatchListData,
      }}
    >
      {children}
    </WatchListCtx.Provider>
  );
}

export function useWatchListCtx() {
  return useContext(WatchListCtx);
}

// Actions
function AddMovie(setWatchListData, movieId) {
  setWatchListData((prev) => [...prev, movieId]);
}

function RemoveMovie(setWatchListData, movieId) {
  setWatchListData((prev) => prev.filter((mId) => mId !== movieId));
}

function SaveWatchList(watchListData) {
  const json = JSON.stringify(watchListData);
  localStorage.setItem('movie-app-watchlist', json);
}

function LoadWatchList() {
  let json = localStorage.getItem('movie-app-watchlist');

  if (json == null) json = '[]';

  return JSON.parse(json);
}

export const Actions = {
  AddMovie,
  RemoveMovie,
  SaveWatchList,
  LoadWatchList,
};
