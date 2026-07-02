import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getMovieDetails, getWatchProviders } from "../api/tmdb";

// 2 movies are "the same" if they share a tmdbId, orif the name n year match.
export function isSameMovie(a, b) {
  if (a.tmdbId && b.tmdbId) return a.tmdbId === b.tmdbId;
  const aName = (a.Name || "").trim().toLowerCase();
  const bName = (b.Name || "").trim().toLowerCase();
  return aName === bName && String(a.Year) === String(b.Year);
}

async function getUserRefAndData() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  return { ref, data: snap.exists() ? snap.data() : {} };
}

//add to watchlist from search bar
export async function addMovieToWatchlist(basicMovie) {
  const { ref, data } = await getUserRefAndData();
  const watchlistMovies = data.watchlistMovies || [];

  const candidate = {
    Name: basicMovie.title,
    Year: basicMovie.year,
    tmdbId: basicMovie.tmdbId,
  };

  if (watchlistMovies.some((m) => isSameMovie(m, candidate))) {
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

  const updated = [movie, ...watchlistMovies];
  await updateDoc(ref, {
    watchlistMovies: updated,
    watchlistCount: updated.length,
  });

  return { alreadyAdded: false, watchlistMovies: updated, movie };
}

//remove a movie from watchlist
export async function removeMovieFromWatchlist(movie) {
  const { ref, data } = await getUserRefAndData();
  const watchlistMovies = (data.watchlistMovies || []).filter(
    (m) => !isSameMovie(m, movie)
  );

  await updateDoc(ref, {
    watchlistMovies,
    watchlistCount: watchlistMovies.length,
  });

  return watchlistMovies;
}

//move a movie from the watchlist into the watched list.
export async function markMovieAsWatched(movie) {
  const { ref, data } = await getUserRefAndData();
  const watchlistMovies = (data.watchlistMovies || []).filter(
    (m) => !isSameMovie(m, movie)
  );
  const existingWatched = data.watchedMovies || [];
  const alreadyWatched = existingWatched.some((m) => isSameMovie(m, movie));
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

//adding only new movies
export function dedupeAgainstWatchlist(candidateMovies, existingMovies) {
  return candidateMovies.filter(
    (candidate) => !existingMovies.some((m) => isSameMovie(m, candidate))
  );
}

//filter by title
export function searchWatchlist(movies, term) {
  const q = term.trim().toLowerCase();
  if (!q) return movies;
  return movies.filter((m) => m.Name?.toLowerCase().includes(q));
}

export async function getWatchlistTmdbIds() {
  const user = auth.currentUser;
  if (!user) return new Set();
  const snap = await getDoc(doc(db, "users", user.uid));
  const movies = snap.exists() ? snap.data().watchlistMovies || [] : [];
  return new Set(movies.filter((m) => m.tmdbId).map((m) => m.tmdbId));
}