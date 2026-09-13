const apiKey = '7871cf68ddf81a6a551e611f28b927ee'
const baseUrl = 'https://api.themoviedb.org/3'
const imageBase = 'https://image.tmdb.org/t/p/w500'

const modalOverlay = document.querySelector('.modal-overlay')
const modalTitle = document.querySelector('.modal-title')
const movieYear = document.querySelector('.movie-year')
const movieGenre = document.querySelector('.movie-genre')
const movieRating = document.querySelector('.movie-rating')
const modalImage = document.querySelector('.modal-image')
const modalDescription = document.querySelector('.modal-description')

const closeModal = document.querySelector('.close-modal')

const searchButton = document.querySelector('.search-container button')
const searchBar = document.querySelector('.search-bar')
const searchContainer = document.querySelector('.search-container')

const searchSuggestions = document.querySelector('.search-suggestions')

const categoriesContainer = document.querySelector('.categories-container')

const trendingOptions = [
    { name: 'Trending Today', endpoint: '/trending/all/day' },
    { name: 'Trending This Week', endpoint: '/trending/all/week' },
    { name: 'Trending Movies', endpoint: '/trending/movie/week' },
    { name: 'Trending Series', endpoint: '/trending/tv/week' }
]

const moviesOptions = [
    { name: 'Popular Movies', endpoint: '/movie/popular' },
    { name: 'Top Rated Movies', endpoint: '/movie/top_rated' },
    { name: 'Now Playing', endpoint: '/movie/now_playing' },
    { name: 'Upcoming Movies', endpoint: '/movie/upcoming' }
]

const seriesOptions = [
    { name: 'Popular Series', endpoint: '/tv/popular' },
    { name: 'Top Rated Series', endpoint: '/tv/top_rated' },
    { name: 'Airing Today', endpoint: '/tv/airing_today' },
    { name: 'On The Air', endpoint: '/tv/on_the_air' }
]

async function loadHomePage() {
    const trending = randomPick(trendingOptions)
    const movies = randomPick(moviesOptions)
    const series = randomPick(seriesOptions)

    const [trendingResults, moviesResults, seriesResults, topRated] = await Promise.all([
        fetchTMDB(trending.endpoint, randomPage()),
        fetchTMDB(movies.endpoint, randomPage()),
        fetchTMDB(series.endpoint, randomPage()),
        fetchTMDB('/movie/top_rated', randomPage())
    ])

    const shapedTrending = trendingResults.map(shapeData)
    const shapedMovies = moviesResults.map(shapeData)
    const shapedSeries = seriesResults.map(shapeData)
    const shapedTopRated = topRated.map(shapeData)

    allItems = [...shapedTrending, ...shapedMovies, ...shapedSeries, ...shapedTopRated]

    renderCategory(trending.name, shapedTrending)
    renderCategory(movies.name, shapedMovies)
    renderCategory(series.name, shapedSeries)
    renderCategory('Top Rated', shapedTopRated)
}

loadHomePage()

async function fetchTMDB(endpoint, page = 1) {
    const resolution = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&language=en-US`)
    const data = await resolution.json()
    return data.results
}

fetchTMDB('/trending/all/day').then(results => {
    const shaped = results.map(shapeData)
})

function shapeData(data) {
    const isTv = data.media_type === 'tv' || data.name !== undefined

    return {
        id: data.id,
        title: isTv ? data.name : data.title,
        image: data.poster_path ? imageBase + data.poster_path : '',
        year: (data.release_date || data.first_air_date || '').slice(0, 4),
        rating: data.vote_average?.toFixed(1) || 'N/A',
        description: data.overview || ''
    }
}

function renderCategory(name, items) {

    const categoryElement = document.createElement('div')
    categoryElement.classList.add('category')

    categoryElement.innerHTML = `
            <h2 class="category-title">${name}</h2>
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

    items.forEach(item => {
        const image = document.createElement('img')

        image.src = item.image
        image.alt = item.title

        movieRow.appendChild(image)

        image.addEventListener('click', () => openMovieModal(item))
    })

    categoryElement.querySelector('.left-button').addEventListener('click', () => {
        movieRow.scrollLeft -= 500
    })

    categoryElement.querySelector('.right-button').addEventListener('click', () => {
        movieRow.scrollLeft += 500
    })

    categoriesContainer.appendChild(categoryElement)
}



searchButton.addEventListener('click', () => {
    searchBar.classList.add('show')
    searchContainer.classList.add('show')
    searchBar.focus()
})

closeModal.addEventListener('click', () => {
    modalOverlay.classList.remove('show')
})


document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target)) {
        searchBar.classList.remove('show');
        searchContainer.classList.remove('show');

        searchSuggestions.innerHTML = ''
        categoriesContainer.classList.remove('searching')
    }
})

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase().trim()

    searchSuggestions.innerHTML = ''

    if (searchTerm === '') {
        categoriesContainer.classList.remove('searching')
        return
    }

    categoriesContainer.classList.add('searching')

    allItems
        .filter(item => item.title.toLowerCase().includes(searchTerm))
        .forEach(item => {
            const img = document.createElement('img')
            img.src = item.image
            img.classList.add('search-result')
            img.addEventListener('click', () => openMovieModal(item))
            searchSuggestions.appendChild(img)
        })
})


function openMovieModal(item) {
    modalOverlay.classList.add('show')

    modalTitle.textContent = item.title
    movieYear.textContent = item.year
    movieGenre.textContent = item.genre
    movieRating.textContent = item.rating
    modalImage.src = item.image
    modalDescription.textContent = item.description
}

function randomPage() {
    return Math.floor(Math.random() * 5) + 1
}

function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}