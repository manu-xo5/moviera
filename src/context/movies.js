import { createContext, useContext, useState } from "react";

const MoviesCtx = createContext();

function useMoviesCtx() {
  return useContext(MoviesCtx);
}

function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  return (
    <MoviesCtx.Provider value={{ movies, setMovies }}>
      {children}
    </MoviesCtx.Provider>
  );
}

export { useMoviesCtx, MoviesProvider, MoviesCtx };
