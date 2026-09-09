const modalOverlay = document.querySelector('.modal-overlay')
const modalTitle = document.querySelector('.modal-title')
const movieYear = document.querySelector('.movie-year')
const movieGenre = document.querySelector('.movie-genre')
const movieRating = document.querySelector('.movie-rating')
const modalImage = document.querySelector('.modal-image')

const closeModal = document.querySelector('.close-modal')

const searchButton = document.querySelector('.search-container button')
const searchBar = document.querySelector('.search-bar')
const searchContainer = document.querySelector('.search-container')

const searchSuggestions = document.querySelector('.search-suggestions')

const categoriesContainer = document.querySelector('.categories-container')

const movies = [
    {
        title: "The Punisher",
        image: "assets/punisher-image.jpg",
        year: 2017,
        genre: "Action",
        rating: "16+"
    },
    {
        title: "Breaking Bad",
        image: "assets/breaking-bad.jpeg",
        year: 2008,
        genre: "Thriller",
        rating: "16+"
    },
    {
        title: "Stranger Things",
        image: "assets/stranger-things.jpeg",
        year: 2016,
        genre: "Fantasy",
        rating: "16+"
    },
    {
        title: "Peaky Blinders",
        image: "assets/peaky-blinders.jpeg",
        year: 2015,
        genre: "Action",
        rating: "16+"
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

searchButton.addEventListener('click', () => {
    searchBar.classList.add('show')
    searchContainer.classList.add('show')
})

document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target)) {
        searchBar.classList.remove('show');
        searchContainer.classList.remove('show');

        // searchBar.value = ''
        searchSuggestions.innerHTML = ''
        document.querySelector('.category').classList.remove('searching')
    }
})

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase().trim()

    searchSuggestions.innerHTML = ''

    if (searchTerm === '') {
        document.querySelector('.category').classList.remove('searching')
        return
    }

    document.querySelector('.category').classList.add('searching')

    const results = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm))

    results.forEach(movie => {
        const suggestion = document.createElement('img')

        suggestion.src = movie.image
        suggestion.classList.add('search-result')

        searchSuggestions.appendChild(suggestion)
    })
})

categories.forEach(category => {
    const categoryElement = document.createElement('div')
    categoryElement.classList.add('category')

    categoryElement.innerHTML = `
            <h2 class="category-title">${category.name}</h2>
            <div class="movie-container">
                <button class="left-button">
                    <span class="material-symbols-outlined">
                        arrow_back_ios_new
                    </span>
                </button>
                    <div class="movie-row">
                        
                    </div>
                <button class="right-button">
                    <span class="material-symbols-outlined">
                        arrow_forward_ios
                    </span>
                </button>
            </div>
    `

    const movieRow = categoryElement.querySelector('.movie-row')

    category.movies.forEach(movie => {
        const image = document.createElement('img')

        image.src = movie.image
        image.alt = movie.title

        image.addEventListener('click', () => {
            modalOverlay.classList.add('show')

            modalTitle.textContent = movie.title
            movieYear.textContent = movie.year
            movieGenre.textContent = movie.genre
            movieRating.textContent = movie.rating
            modalImage.src = movie.image
        })

        movieRow.appendChild(image)
    })

    const leftButton = categoryElement.querySelector('.left-button')
    const rightButton = categoryElement.querySelector('.right-button')

    rightButton.addEventListener('click', () => {
        movieRow.scrollLeft += 500
    })

    leftButton.addEventListener('click', () => {
        movieRow.scrollLeft -= 500
    })

    categoriesContainer.appendChild(categoryElement)
})

