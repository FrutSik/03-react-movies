import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(false);
    setMovies([]);

    try {
      const data = await fetchMovies(query);

      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
      }

      setMovies(data.results);
    } catch (err) {
      setError(true);
      console.error("Error fetching movies:", err);
      toast.error("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      <main className={styles.main}>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        )}
      </main>

      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default App;
