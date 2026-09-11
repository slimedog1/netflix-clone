const movies = [
    {
        title: "The Punisher",
        image: "assets/punisher-image.jpg",
        year: 2017,
        genre: "Action",
        rating: "16+",
        type: "series"
    },
    {
        title: "Breaking Bad",
        image: "assets/breaking-bad.jpeg",
        year: 2008,
        genre: "Thriller",
        rating: "16+",
        type: "series"
    },
    {
        title: "Stranger Things",
        image: "assets/stranger-things.jpeg",
        year: 2016,
        genre: "Fantasy",
        rating: "16+",
        type: "series"
    },
    {
        title: "Peaky Blinders",
        image: "assets/peaky-blinders.jpeg",
        year: 2015,
        genre: "Action",
        rating: "16+",
        type: "movie"
    }
]

const categories = [
    {
        name: "Trending Now",
        movies: movies
    },
    {
        name: "Popular on Netflix",
        movies: movies
    },
    {
        name: "Action",
        movies: movies.filter(movie => movie.genre === "Action")
    },
    {
        name: "Thriller",
        movies: movies.filter(movie => movie.genre === "Thriller")
    }
]

const movieList = movies.filter(movie => movie.type === "movie")
const seriesList = movies.filter(movie => movie.type === "series")