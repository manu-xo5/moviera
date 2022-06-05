import Navbar from "components/navbar";
import ScrollWrapper from "components/scroll-wrapper";
import { MoviesProvider } from "context/movies";
import { WatchListProvider } from "context/watchlist";

import "../styles/globals.css";
import "../styles/reset.css";
import "../styles/utils.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoviesProvider>
      <WatchListProvider>
        <Navbar />
        <ScrollWrapper>
          <Component {...pageProps} />
        </ScrollWrapper>
      </WatchListProvider>
    </MoviesProvider>
  );
}

export default MyApp;
