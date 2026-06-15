const API_KEY = "b666641cd77d685416127493ceda63ac";

export async function getPopularMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
  );

  const data = await response.json();

  return data.results;
}

export async function searchMovie(title, year) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
  );

  const data = await response.json();

  if (!data.results?.length) {
    return null;
  }

  const match =
    data.results.find(
      movie => movie.release_date?.startsWith(year)
    ) || data.results[0];

  return {
    tmdbId: match.id,
    posterPath: match.poster_path,
    rating: match.vote_average
  };
}

export async function getWatchProviders(tmdbId) {

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${API_KEY}`
  );

  const data = await response.json();

  const indiaProviders =
    data.results?.IN?.flatrate || [];

  return indiaProviders.map(
    provider => provider.provider_name
  );
}