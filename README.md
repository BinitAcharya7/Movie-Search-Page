# Cinemate 🎬

A sleek, responsive movie and TV show search application that fetches data from the OMDB API and TMDB API. Search for any movie or TV show, view detailed information including ratings from IMDb, Rotten Tomatoes, and Metacritic, sort/filter results, and watch content directly in the app.

## Features

- **Search Functionality**: Search for any movie or TV show by title
- **Watch Content**: Stream movies and TV shows directly in the application
- **Detailed Information**: View comprehensive details for both movies and TV shows including:
  - Title, Genre, Runtime, Year, Type
  - Poster images
  - Ratings from multiple sources (IMDb, Rotten Tomatoes, Metacritic)
  - Direct links to rating sources
- **Dynamic Rating Icons**: 
  - IMDb ratings with logo
  - Rotten Tomatoes with Certified Fresh, Fresh, or Rotten icons based on score
  - Metacritic with color-coded score boxes (green, yellow, red)
- **Sorting Options**:
  - IMDb Rating (High to Low)
  - Runtime (Low to High)
  - Runtime (High to Low)
- **Year Filter**: Filter movies and TV shows by year range (1910-2020)
- **Featured Content**: Displays 15 random featured movies and TV shows on initial load
- **Loading Spinner**: Visual feedback during API requests
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Core functionality
- **OMDB API** - Movie and TV show data
- **TMDB API** - Streaming content source
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Orbitron, Montserrat)

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd omdb-api-project
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 5500

# Or using Node.js
npx http-server
```

3. Start searching for movies and TV shows!

## API Keys

This project uses the OMDB API and TMDB API. The current API keys are included in the code, but for production use, you should:
1. Get your own free API key from [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Get your own free API key from [TMDB API](https://www.themoviedb.org/settings/api)
3. Replace the API keys in `movies.js` and `movie.js`

## Project Structure

```
omdb-api-project/
├── index.html          # Main page with search and movie list
├── movie.html          # Individual movie details page
├── movies.js           # Main JavaScript for search/sort/filter
├── movie.js            # JavaScript for individual movie page
├── styles.css          # All styling
├── assets/             # Images and icons
│   ├── imdb.webp
│   ├── certified-fresh.png
│   ├── fresh.png
│   ├── rotten.png
│   ├── favicon.png
│   └── ...
└── README.md
```

## How It Works

1. **Initial Load**: Displays 15 random featured movies and TV shows from a curated list
2. **Search**: Users can search for movies or TV shows by title, which fetches results from OMDB API
3. **Detailed Fetch**: For each search result, the app fetches full details including ratings from OMDB
4. **Rendering**: Content is displayed as cards with posters, details, and interactive rating icons
5. **Watch**: Click on any movie or TV show to view it in the integrated player
6. **Sorting/Filtering**: Users can sort by rating or runtime, and filter by year range

## Features in Detail

### Rating System
- **IMDb**: Shows score out of 10 with clickable logo linking to IMDb page
- **Rotten Tomatoes**: Dynamic icon based on score:
  - ≥75%: Certified Fresh
  - 60-74%: Fresh
  - <60%: Rotten
- **Metacritic**: Color-coded score box:
  - ≥60: Green
  - 40-59: Yellow
  - <40: Red


## Future Enhancements

- Pagination for search results
- Genre filtering
- Watchlist/favorites functionality
- Dark/light mode toggle
- Advanced search options (by actor, director, year)


## Acknowledgments

- Movie and TV show data provided by [OMDB API](http://www.omdbapi.com/)
- Streaming content provided by [TMDB API](https://www.themoviedb.org/)
- Rating icons from respective platforms
- Font Awesome for UI icons
