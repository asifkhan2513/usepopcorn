import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import StarRating from "./Components/StartRating";
const KEY = process.env.REACT_APP_API_KEY || "414128c4";

// Remove tempMovieData since it's not being used
// const tempMovieData = [ ... ];

// Remove tempWatchedData since it's not being used
// const tempWatchedData = [ ... ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Navbar({ children, movies }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
      <NumsResult movies={movies} />
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      // Add the event listener
      document.addEventListener("keydown", callback);

      // Cleanup function
      return () => document.removeEventListener("keydown", callback);
    },
    [setQuery]
  );

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />
      {/* <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p> */}
    </>
  );
}
function NumsResult({ movies }) {
  // If movies is undefined or null, show 0 results
  const numResults = movies?.length || 0;

  return (
    <p className="num-results">
      Found <strong>{numResults}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ element }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && element}
    </div>
  );
}
function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedMovie }) {
  return (
    <li
      onClick={() => {
        onSelectedMovie(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
/*
function WatchedBox() {
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && <Watchsummary watched={watched} />}
      <>
        <WatchedMovieList watched={watched} />
      </>
    </div>
  );
}
  */
function Watchsummary({ watched }) {
  if (!watched || watched.length === 0) {
    return (
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>0 movies</span>
          </p>
        </div>
      </div>
    );
  }

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieList({ watched, onDeleteWatched }) {
  // const [watched, setWatched] = useState(tempWatchedData);

  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img
        src={movie.poster || movie.Poster}
        alt={`${movie.title || movie.Title} poster`}
      />
      <h3>{movie.title || movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
function Loading() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠️</span>
      {message}
    </p>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setuserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Release: release,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function handleAdd() {
    const newMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      // release,
      // actors,
      // director,
      // genre
    };
    onAddWatched(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  // useEffect(() => (document.title = `Movies ${title}`), [title]);
  useEffect(
    function () {
      if (!title) {
        return;
      }
      document.title = `Movies ${title}`;
      return function () {
        document.title = "usepopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {release} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                <span>{imdbRating} IMDB rating</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setuserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list{" "}
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this Movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Dired by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
export default function App() {
  const [query, setQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue) || [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const tempQuery = "batman";
  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function onCloseMovie() {
    return setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") {
        // handleCloseMovie();
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  //   },
  //   [watched]
  // );
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Something Went Wrong");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("No results found");
        }
        setMovies(data.Search);
        setError("");
        // Log the total results to check
        console.log("Total results:", data.totalResults);
        setIsLoading(false);
      } catch (error) {
        console.error(error.message);
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <Helmet>
        <title>
          UsePopcorn - Discover, Rate & Track Movies | Ratings, Trailers,
          Watchlist
        </title>

        <meta
          name="description"
          content="UsePopcorn helps you discover trending movies, watch trailers, compare ratings, and track what you’ve watched. Build your watchlist, rate films, and keep your personal movie diary in one place."
        />

        <meta
          name="keywords"
          content="UsePopcorn, movie discovery, movie ratings, trailers, watchlist, movie tracker, films, cinema database, trending movies, usepopcorn, top rated movies, IMDB ratings, personal movie log, what to watch, movie recommendations, popcorn app"
        />

        <meta
          property="og:title"
          content="UsePopcorn - Discover, Rate & Track Movies"
        />
        <meta
          property="og:description"
          content="Find movies fast, watch trailers, rate what you watch, and organize your watchlist with UsePopcorn."
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="UsePopcorn - Discover, Rate & Track Movies"
        />
        <meta
          name="twitter:description"
          content="Discover trending movies, watch trailers, and track your watched list with your own ratings."
        />
      </Helmet>

      <Navbar movies={movies}>
        <SearchBar query={query} setQuery={setQuery} />
      </Navbar>
      <Main>
        <Box
          element={
            isLoading ? (
              <Loading />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <MovieList
                movies={movies}
                onSelectedMovie={handleSelectedMovie}
              />
            )
          }
        />
        <Box
          element={
            selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={onCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <Watchsummary watched={watched} isLoading={isLoading} />
                <WatchedMovieList
                  watched={watched}
                  isLoading={isLoading}
                  onDeleteWatched={handleDeleteWatched}
                />
              </>
            )
          }
        />
        {/*<Box>
          <MovieList movies={movies} />
        </Box>
        <Box>
          <Watchsummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box> */}
        {/* <WatchedBox /> */}
      </Main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer-legal">
      <div className="footer-content">
        <p> design and developern by asif khan</p>
        <div className="legal-container">
          <div className="legal-section">
            <h3>Privacy Policy</h3>
            <p>
              At <strong>UsePopcorn</strong> (https://usepopcorn.store/), we
              prioritize your privacy. We do **not** collect, store, or share
              any personal identity data. Your "Watched" list and movie ratings
              are stored exclusively in your browser's
              <strong> Local Storage</strong>, ensuring your data never leaves
              your device.
            </p>
          </div>
          <div className="legal-section">
            <h3>Terms & Conditions</h3>
            <p>
              By using UsePopcorn, you agree to use the platform for personal,
              non-commercial movie discovery. Data is retrieved via the OMDb
              API; we do not claim ownership of movie imagery or descriptions.
              The service is provided "as-is" without warranties of any kind.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
