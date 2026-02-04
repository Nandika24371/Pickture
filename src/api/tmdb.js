const API_KEY = "b666641cd77d685416127493ceda63ac";
//TODO: Move API key to environment variable for better security

// This function gets popular movies from TMDB
export async function getPopularMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results; // This is an array of movies
}