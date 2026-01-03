// http://www.omdbapi.com/?s=thor&apikey=605455b9

//&page=1

// http://www.omdbapi.com/?apikey=605455b9&i=tt3896198

let movies = [];

function searchedTitle() {
  const title = document.querySelector('.search-bar').value;
  if (!title) {
    alert('Please enter a title');
    return;
  }
  renderMovies(title); // call with argument
  // so that we can use getMovies() on
  // search ###
}

function sortMovies(event) {
  renderMovies(null, event.target.value); // same logikkk. if we dont call it with null this will event.target.value will basically become title lolmao###
}

async function getMovies(title) {
  const response = await fetch(
    `http://www.omdbapi.com/?s=${title}&apikey=605455b9`
  );
  const data = await response.json();
  let searchResults = data.Search || []; /* Search is the array
  everything is inside in the API and search
  is wrapped inside the object that's
  returned.*/

  /* now to get the full details with the
  &t endpoint since &s is lacking */

  await getFullDetails(searchResults);
}

// async function getFullDetails(searchResults) {
//   return Promise.all(
//     searchResults.map(async (searchResult) => {
//       const data = await fetch(
//         `http://www.omdbapi.com/?i=${searchResult.imdbID}&apikey=605455b9`
//       );
//       movies = await data.json();
//       return movies;
//     })
//   );
// } /* TRICKY###. if we just overwrite movies array like that all it will end up with is the last ever movie. movies is our global array. instead we use a local movie variable (NOT an array) which gathers up all the movie obejcts and finally we assign that to our movies array */

async function getFullDetails(searchResults) {
  movies = await Promise.all(
    searchResults.map(async (searchResult) => {
      const data = await fetch(
        `http://www.omdbapi.com/?i=${searchResult.imdbID}&apikey=605455b9`
      );
      const movie = await data.json();
      return movie; /* movie is in scope of this map function and won't overwrite itself everytime we map. on each map we essentially get a different movie ### also all the maps happen CONCURRENTLY###*/
    })
  );
}

async function renderMovies(title, sorting) {
  // If title is passed (search), fetch new movies.
  //  otherwise use existing movies array. CORE LOGIC###
  if (title && !sorting) {
    await getMovies(title);
  }

  /* think aboutescaping awaits for filter and
   sort ### COME BACK TO THIS */

  /* A temporary variable for the express purpose of displaying movies (like we did in library project) and its scope is only within this function as its only for displaying movies ofc */
  let displayMovies = movies.map((movie) => ({ ...movie }));

  // sort
  if (sorting === 'RATING') {
    displayMovies.sort(
      (a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating)
    );
  } else if (sorting === 'HIGH_TO_LOW') {
    displayMovies.sort((a, b) => parseInt(b.Runtime) - parseInt(a.Runtime));
  } else if (sorting === 'LOW_TO_HIGH') {
    displayMovies.sort((a, b) => parseInt(a.Runtime) - parseInt(b.Runtime));
  }

  // filter (since we do this after sort)

  // change rating to stars (in displayMovies variable)

  // actually render the books. 1st mount random books template stringed then by search

  document.querySelector('.movies-list').innerHTML = displayMovies
    .map(
      (movie) => `<div class="movie-card">
        <img src = ${movie.Poster} alt = "Movie Poster of the movie ${
        movie.Title
      }"/>
        <div class = "movie-details">
          <div class="title">
              <span class = "bold-text">Title:</span> ${movie.Title} 
          </div>
          <div class="genre">
              <span class = "bold-text">Genre:</span> ${movie.Genre} 
          </div>
          <div class="runtime">
              <span class = "bold-text">Runtime:</span> ${movie.Runtime} 
          </div>
          <div class="year">
              <span class = "bold-text">Year:</span> ${movie.Year} 
          </div>
          <div class="type">
              <span class = "bold-text">Type:</span> ${movie.Type} 
          </div>
          <div class="ratings">
          ${displayAllRatings(movie)}
          </div>
        </div>
    </div>`
    )
    .join('');
}

function displayAllRatings(movie) {
  const ratings = movie.Ratings;
  const imdbID = movie.imdbID;

  const changedTitleTomato = movie.Title.replaceAll(' ', '_')
    .replaceAll(',', '')
    .replaceAll(':', '')
    .replaceAll('-', '_')
    .replaceAll("'", '')
    .toLowerCase();
  const changedTitleMeta = movie.Title.replaceAll(' ', '-')
    .replaceAll(',', '')
    .replaceAll(':', '')
    .replaceAll("'", '')
    .toLowerCase();
  const slicedType = movie.Type.slice(0, 1);
  const metaType = movie.Type === 'movie' ? 'movie' : 'tv';

  return ratings
    .map((rating) => {
      if (rating.Source === 'Internet Movie Database') {
        return `<a href = "https://www.imdb.com/title/${imdbID}/" target = "_blank"><img src = "assets/imdb.webp" width = "35" height = "35"></a>${rating.Value.slice(
          0,
          rating.Value.indexOf('/')
        )}`;
      }
      if (rating.Source === 'Rotten Tomatoes') {
        return parseFloat(rating.Value) >= 75
          ? `<a href = "https://www.rottentomatoes.com/${slicedType}/${changedTitleTomato}" target = "_blank"><img src = "assets/certified-fresh.png" width = "35" height = "35"></a>${rating.Value}`
          : parseFloat(rating.Value) >= 60
          ? `<a href = "https://www.rottentomatoes.com/${slicedType}/${changedTitleTomato}" target = "_blank"><img src = "assets/fresh.png" width = "35" height = "35"></a>${rating.Value}`
          : `<a href = "https://www.rottentomatoes.com/${slicedType}/${changedTitleTomato}" target = "_blank"><img src = "assets/rotten.png" width = "35" height = "35"></a>${rating.Value}`;
      }
      if (rating.Source === 'Metacritic') {
        return parseFloat(rating.Value) >= 60
          ? `<a href = "https://www.metacritic.com/${metaType}/${changedTitleMeta}" target = "_blank"><div class = "meta" style = "background-color: #54ac28ff;">${rating.Value.slice(
              0,
              rating.Value.indexOf('/')
            )}</div></a>`
          : parseFloat(rating.Value) >= 40
          ? `<a href = "https://www.metacritic.com/${metaType}/${changedTitleMeta}" target = "_blank"><div class = "meta" style = "background-color: #D9B42C;">${rating.Value.slice(
              0,
              rating.Value.indexOf('/')
            )}</div></a>`
          : `<a href = "https://www.metacritic.com/${metaType}/${changedTitleMeta}" target = "_blank"><div class = "meta" style = "background-color: #e50e0eff;">${rating.Value.slice(
              0,
              rating.Value.indexOf('/')
            )}</div></a>`;
      }
    })
    .join('');
}

// Displays on initial load

const popularMovies = [
  'The Big Lebowski',
  'The Matrix',
  "The Pervert's Guide to Ideology",
  "The Pervert's Guide to Cinema",
  'Dirty Work',
  'Billy Madison',
  'Bee Movie',
  'Rango',
  'Little Miss Sunshine',
  'Monsters, Inc.',
  'Reservoir Dogs',
  'Monsters Inc. 2',
  'The Banshees of Inisherin',
  'Taxi Driver',
  'Pulp Fiction',
  'Fight Club',
  'Monty Python and the Holy Grail',
  'Perfect Days',
  'Borat',
  'Freddy Got Fingered',
  'American Psycho',
  'Falling Down',
  'Fargo',
  'Fear and Loathing in Las Vegas',
  'No Country for Old Men',
  "Wayne's World",
  'Shrek',
  'Uncut Gems',
  'Shrek the Third',
  'Shrek 2',
  'The Big Short',
  'Trainspotting',
  'Forrest Gump',
  'The Hangover',
  'The Shawshank Redemption',
  'Goodfellas',
  'The Godfather',
  'Parasite',
  'Bhaag Milka Bhaag',
  'Dune',
  'Blade Runner',
  'The Room',
  'Khichdi: The Movie',
  'The 40-Year-Old Virgin',
  'Pulp Fiction',
  'Pump Friction',
  'Titanic',
  'Jurassic Park',
];

function getRandomMovies() {
  const shuffled = [...popularMovies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 15);
}

async function displayInitialMovies() {
  const randomTitles = getRandomMovies();

  for (const title of randomTitles) {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=605455b9&t=${title}`
    );
    const movie = await response.json();

    /* can't use getMovies() because that uses &S and if we used &s here we'd get like 10 results for 1 title even if the title is the exact match.*/
    movies.push(movie);
  }

  renderMovies(); // call without arguments
  // so that we don't have to await the
  // getMovies (&s= version)###.
}

displayInitialMovies();
