//https://api.themoviedb.org/3/movie/11?api_key=254c69a49b0450ae64a458e2d6b6b574

// get the url ID that was sent by URL params
let tmdbData;
async function getMovie() {
  const urlParams = new URLSearchParams(window.location.search);

  const imdbID = urlParams.get('id'); // because ?id=${imdbID}

  // (try to) get the movie

  let movie = JSON.parse(
    localStorage.getItem('movie')
  ); /* now actually turn that stored(stringified) object to actual object with properties ;-) */

  // fetch it if the id wasn't passed or if a shared link was opened or we just dont have the movie. whatever just a fallback.

  if (!movie || movie.imdbID !== imdbID) {
    const data = await fetch(
      `http://www.omdbapi.com/?apikey=fda29c77&i=${imdbID}`
    );
    movie = await data.json();
    return movie;
  }
  return movie;

  /* second check is for local storage overwrites. so if i click on the room and then i click on khichdi i get khichdi in my movie object and the room is gone. so when i go back to my the room tab and refresh it, it now has khichdi. 

so if we only checked if a movie exists, we'd actually get khichdi shown in the Room's url (even if the id is different in that link). 

its true for 1) just a single user opening multiple tabs and goes back to the other tab then refresh; 2) also for when a user shares a link, and the other guy already has some movie in his localstorage (so he has visited the site before),and now he clicks on this new movie link that was shared to him only to find another movie he watched before show up or 3) bookmarks this unique link, clicks on it after some time only to find another movie show up using this bookmarked link. ###

OBVS it wouldnt happen if you just go back and click on a different card. then ta everything updates (both movie and url so no mismatch there)###

TL;DR: the unique link will not have the unique movie without that second check ### so its just a localStorage vs link mismatch we're handling here*/
}

// eberything loaded and ready to go: -

async function renderMovie() {
  const movie = await getMovie();
  tmdbData = await getTmdbID(movie.imdbID);
  const iframeURL =
    tmdbData.type === 'movie'
      ? `https://www.vidking.net/embed/movie/${tmdbData.tmdbID}?color=ff2a6d`
      : `https://www.vidking.net/embed/tv/${tmdbData.tmdbID}/1/1?color=fb5607`;
  document.getElementById('movie-information').innerHTML = `
        <iframe src="${iframeURL}" width="100%" height="600" frameborder="0" allowfullscreen> </iframe>
        <figure class = "movie-figure">
            <img src="${
              movie.Poster
            }" class = "movie-detailed-image" alt="Movie Poster of the movie ${
    movie.Title
  }">
            <div class="ratings ratings-detailed">
            ${displayAllRatings(movie)}
          </div>
        </figure>
        <div class = "movie-details movie-single">
        <div class="plot" id = "plot-not-detailed">
              <span class = "bold-text">Plot:</span> ${
                movie.Plot
              } <button class = "plot-expander" onclick = "plotExpander('${
    movie.imdbID
  }')"> Know More (Spoilers) 
  <i class="fas fa-spinner movies-loading-spinner"></i>
  </button>
          </div>
          <div class="title">
              <span class = "bold-text">Title:</span> ${movie.Title} 
          </div>
          <div class="type">
              <span class = "bold-text">Type:</span> ${movie.Type} 
          </div>
          <div class="genre">
              <span class = "bold-text">Genre:</span> ${movie.Genre} 
          </div>
          <div class="director">
              <span class = "bold-text">Director:</span> ${movie.Director} 
          </div>
          <div class="writers">
              <span class = "bold-text">Writers:</span> ${movie.Writer} 
          </div>
          <div class="actors">
              <span class = "bold-text">Actors:</span> ${movie.Actors} 
          </div>
          <div class="awards">
              <span class = "bold-text">Awards:</span> ${movie.Awards} 
          </div>
          <div class="boxoffice">
              <span class = "bold-text">BoxOffice:</span> ${movie.BoxOffice} 
          </div>
          <div class="runtime">
              <span class = "bold-text">Runtime:</span> ${movie.Runtime} 
          </div>
          <div class="year">
              <span class = "bold-text">Year:</span> ${movie.Year} 
          </div>
       
`;
  /* change favicon and title with js */
  document.title = movie.Title;
  const favicon =
    document.querySelector(
      "link[rel='icon']"
    ); /* attribute value wala selector (select the link whose rel attribute is icon) */
  favicon.href = movie.Poster;
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

async function plotExpander(id) {
  let movie;
  const data = await fetch(
    `http://www.omdbapi.com/?apikey=fda29c77&i=${id}&plot=full`
  );
  movie = await data.json();
  document.getElementById(
    'plot-not-detailed'
  ).innerHTML = `<span class = "bold-text">Plot:</span> ${movie.Plot}<button class = "plot-lesspander" onclick = "plotLesspander('${movie.imdbID}')"> NOOO I CAN'T HANDLE IT!!! THE BEACON OF TRUTH IS TOO BRIGHT</button>`;
}

async function plotLesspander(id) {
  let movie;
  const data = await fetch(
    `http://www.omdbapi.com/?apikey=fda29c77&i=${id}&plot=short`
  );

  movie = await data.json();

  document.getElementById(
    'plot-not-detailed'
  ).innerHTML = `<span class = "bold-text">Plot:</span> ${movie.Plot}<button class = "plot-expander" onclick = "plotExpander('${movie.imdbID}')"> Want the red pill again?</button>`;
}

renderMovie();

async function getTmdbID(imdbID) {
  const data = await fetch(
    `https://api.themoviedb.org/3/find/${imdbID}?api_key=254c69a49b0450ae64a458e2d6b6b574&external_source=imdb_id`
  );
  let response = await data.json();

  if (response.movie_results?.[0]?.id) {
    return { tmdbID: response.movie_results[0].id, type: 'movie' };
  } else if (response.tv_results?.[0]?.id) {
    return { tmdbID: response.tv_results[0].id, type: 'tv' };
  }

  return null;
} /* nullish coalescing would do the same thing since ids cant be 0. ?? also treats 0 as existing/not false while || would treat an id of 0 (if such a thing existed) as not existing/false/null */

/* vidking api progress rememberer */
window.addEventListener('message', function (event) {
  // console.log("event: ", event);
  console.log('Message received from the player: ', JSON.parse(event.data)); // Message received from player
  if (typeof event.data === 'string') {
    var messageArea = document.querySelector('#messageArea');
    messageArea.innerText = event.data;
  }
});
