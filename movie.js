    let movies = [];

async function getMovies(title) {
    const response = await fetch('http://www.omdbapi.com/?s=${title}&apikey=23df0941')
    movies  = await response.json();
}


async function renderMovies() {
    document.querySelector('.movies-list').innerHTML = `<div class="movie-card movie-card-detailed">
        <img src = ${""} alt = "Movie Poster of the movie ${}"/>
        <div class="title">
            <span class = "bold-text">Title:</span>${title} 
        </div>
        <div class="genre">
            <span class = "bold-text">Genre:</span>${title} 
        </div>
        <div class="year">
            <span class = "bold-text">Year:</span>${title} 
        </div>
        <div class="runtime">
            <span class = "bold-text">Runtime:</span>${title} 
        </div>

        <div class="ratings">
        ${displayAllRatings()}
        </div>
    </div>`
}