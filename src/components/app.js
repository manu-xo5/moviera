import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "pages";
import MovieDetails from "pages/movie/details";
import MovieEpisodes from "pages/movie/episode";
import Search from "pages/search";
import { MoviesProvider } from "context/movies";
import { WatchListProvider } from "context/watchlist";
import Discover from "pages/discover";
import WatchList from "pages/watchlist";
import Navbar from "components/navbar";
import ScrollWrapper from "components/scroll-wrapper";

export default function App() {
  return (
    <>
      <MoviesProvider>
        <WatchListProvider>
          <BrowserRouter>
            <Navbar />
            <ScrollWrapper>
              <Switch>
                <Route path="/movie/:id/details" component={MovieDetails} />
                <Route path="/movie/:id/episodes" component={MovieEpisodes} />
                <Route path="/search" component={Search} />
                <Route path="/discover" component={Discover} />
                <Route path="/watchlist" component={WatchList} />
                <Route path="/" component={Home} excat />
              </Switch>
            </ScrollWrapper>
          </BrowserRouter>
        </WatchListProvider>
      </MoviesProvider>
    </>
  );
}
