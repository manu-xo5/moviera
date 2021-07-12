const {
  createContext,
  useContext,
  useState,
  useEffect,
  default: React,
} = require("react");

/** @type {React.Context<{ watchListData: (number| string)[], setWatchListData: VoidFunction}>} */
const WatchListCtx = createContext();

export function WatchListProvider({ children }) {
  // array of selected movies' id
  const [watchListData, setWatchListData] = useState(() =>
    Actions.LoadWatchList()
  );

  // save when watchlist changes
  useEffect(() => {
    Actions.SaveWatchList(watchListData);
  }, [watchListData]);

  return (
    <WatchListCtx.Provider value={{ watchListData, setWatchListData }}>
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
  localStorage.setItem("movie-app-watchlist", json);
}

function LoadWatchList() {
  let json = localStorage.getItem("movie-app-watchlist");

  if (json == null) json = "[]";

  return JSON.parse(json);
}

export const Actions = {
  AddMovie,
  RemoveMovie,
  SaveWatchList,
  LoadWatchList,
};
