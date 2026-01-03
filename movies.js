// http://www.omdbapi.com/?s=thor&apikey=23df0941

//&page=1

// http://www.omdbapi.com/?apikey=23df0941&i=tt3896198

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

async function getMovies(title) {
  const response = await fetch(
    `http://www.omdbapi.com/?s=${title}&apikey=23df0941`
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

async function getFullDetails(searchResults){
    await Promise.all(searchResults.map(async(searchResult) => {
    const data = await fetch(`http://www.omdbapi.com/?i=${searchResult.imdbID}&apikey=23df0941`);
    movies = await data.json();
    return movies;
    }
    ));
}

async function renderMovies(title) {
  // If title is passed (search), fetch new movies.
  //  otherwise use existing movies array. CORE LOGIC###
  if (title) {
    await getMovies(title);
  }
  /* think aboutescaping awaits for filter and
   sort ### */

  /* A temporary variable for the express purpose of displaying movies (like we did in library project) and its scope is only within this function as its only for displaying movies ofc */
  let displayMovies = movies.map((movie) => ({ ...movie }));

  // sort

  // filter (since we do this after sort)

  // change rating to stars (in displayMovies variable)

  // actually render the books. 1st mount random books template stringed then by search

  document.querySelector('.movies-list').innerHTML = displayMovies
    .map(
      (movie) => `<div class="movie-card movie-card-basic">
        <img src = ${movie.Poster} alt = "Movie Poster of the movie ${movie.Title}"/>
        <div class="title">
            <span class = "bold-text">Title:</span>${movie.Title} 
        </div>
        <div class="genre">
            <span class = "bold-text">Genre:</span>${movie.Genre} 
        </div>
        <div class="runtime">
            <span class = "bold-text">Genre:</span>${movie.Runtime} 
        </div>
        <div class="year">
            <span class = "bold-text">Year:</span>${movie.Year} 
        </div>
        <div class="type">
            <span class = "bold-text">Type:</span>${movie.Type} 
        </div>
        <div class="ratings">
        ${displayAllRatings(movie.Ratings)}
        </div>
    </div>`
    )
    .join('');
}

function displayAllRatings(ratings){
    ratings.map((rating) => {
        if (rating.Source === "Internet Movie Database"){
            imdbRating = rating.Source;
        }
        if (rating.Source === "Rotten Tomatoes"){
            rottenRating = parseFloat(rating.Value) > 60 ? "":"" 
        }
    }
    )
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
      `https://www.omdbapi.com/?apikey=23df0941&t=${title}`
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



