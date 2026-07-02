import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getMovieDetails, getWatchProviders } from "../api/tmdb";

// Two movies are "the same" if they share a tmdbId, or (for older
// CSV-imported entries that never resolved a tmdbId) if the name + year match.
function sameMovie(a, b) {
  if (a.tmdbId && b.tmdbId) return a.tmdbId === b.tmdbId;
  return a.Name === b.Name && a.Year === b.Year;
}

async function getUserRefAndData() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  return { ref, data: snap.exists() ? snap.data() : {} };
}

/**
 * Add a movie (from a TMDB search result) to the signed-in user's watchlist.
 * basicMovie: { tmdbId, title, year, posterPath, rating }
 */
export async function addMovieToWatchlist(basicMovie) {
  const { ref, data } = await getUserRefAndData();
  const watchlistMovies = data.watchlistMovies || [];

  if (watchlistMovies.some((m) => m.tmdbId === basicMovie.tmdbId)) {
    return { alreadyAdded: true, watchlistMovies };
  }

  const [details, providers] = await Promise.all([
    getMovieDetails(basicMovie.tmdbId),
    getWatchProviders(basicMovie.tmdbId),
  ]);

  const movie = {
    Name: basicMovie.title,
    Year: basicMovie.year,
    tmdbId: basicMovie.tmdbId,
    posterPath: basicMovie.posterPath,
    rating: basicMovie.rating,
    providers,
    runtime: details.runtime,
    genreIds: details.genreIds,
    genres: details.genres,
    overview: details.overview,
    originalLanguage: details.originalLanguage,
  };

  const updated = [...watchlistMovies, movie];
  await updateDoc(ref, {
    watchlistMovies: updated,
    watchlistCount: updated.length,
  });

  return { alreadyAdded: false, watchlistMovies: updated, movie };
}

/** Remove a movie from the watchlist entirely (not marked watched). */
export async function removeMovieFromWatchlist(movie) {
  const { ref, data } = await getUserRefAndData();
  const watchlistMovies = (data.watchlistMovies || []).filter(
    (m) => !sameMovie(m, movie)
  );

  await updateDoc(ref, {
    watchlistMovies,
    watchlistCount: watchlistMovies.length,
  });

  return watchlistMovies;
}

/** Move a movie from the watchlist into the watched list. */
export async function markMovieAsWatched(movie) {
  const { ref, data } = await getUserRefAndData();
  const watchlistMovies = (data.watchlistMovies || []).filter(
    (m) => !sameMovie(m, movie)
  );
  const existingWatched = data.watchedMovies || [];
  const alreadyWatched = existingWatched.some((m) => sameMovie(m, movie));
  const watchedMovies = alreadyWatched
    ? existingWatched
    : [...existingWatched, movie];

  await updateDoc(ref, {
    watchlistMovies,
    watchlistCount: watchlistMovies.length,
    watchedMovies,
    watchedCount: watchedMovies.length,
  });

  return { watchlistMovies, watchedMovies };
}

/** Fetch just the set of tmdbIds currently on the user's watchlist. */
export async function getWatchlistTmdbIds() {
  const user = auth.currentUser;
  if (!user) return new Set();
  const snap = await getDoc(doc(db, "users", user.uid));
  const movies = snap.exists() ? snap.data().watchlistMovies || [] : [];
  return new Set(movies.filter((m) => m.tmdbId).map((m) => m.tmdbId));
}