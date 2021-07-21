import { createContext, useCallback, useContext, useState } from "react";
import { filterBy } from "js/array-utils";

const MoviesCtx = createContext();

function useMoviesCtx() {
  return useContext(MoviesCtx);
}

function MoviesProvider({ children }) {
  const [movies, setMovies__RAW] = useState([]);

  const setMovies = useCallback((newMovies) => {
    setMovies__RAW((prev) => {
      const movies =
        typeof newMovies === "function" ? newMovies(prev) : newMovies;
      return filterBy("id", movies);
    });
  }, []);

  return (
    <MoviesCtx.Provider value={{ movies, setMovies }}>
      {children}
    </MoviesCtx.Provider>
  );
}

export { useMoviesCtx, MoviesProvider, MoviesCtx };
