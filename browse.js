const apiKey = '7871cf68ddf81a6a551e611f28b927ee'
const baseUrl = 'https://api.themoviedb.org/3'
const imageBase = 'https://image.tmdb.org/t/p/w500'

const params = new URLSearchParams(window.location.search)
const pageType = params.get('type')

document.getElementById('page-txt').textContent = pageType === 'movie' ? 'Movies' : 'Series'

const modalOverlay = document.querySelector('.modal-overlay')
const modalTitle = document.querySelector('.modal-title')
const movieYear = document.querySelector('.movie-year')
const movieGenre = document.querySelector('.movie-genre')
const movieRating = document.querySelector('.movie-rating')
const modalImage = document.querySelector('.modal-image')
const modalDescription = document.querySelector('.modal-description')
const closeModal = document.querySelector('.close-modal')
const categoriesContainer = document.querySelector('.categories-container')
const searchButton = document.querySelector('.search-container button')
const searchBar = document.querySelector('.search-bar')
const searchContainer = document.querySelector('.search-container')
const searchSuggestions = document.querySelector('.search-suggestions')

let allItems = []
let currentItem = null

async function fetchTMDB(endpoint, page = 1) {
    const res = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&language=en-US&page=${page}`)
    const data = await res.json()
    return data.results
}

async function fetchGenres() {
    const endpoint = pageType === 'movie' ? '/genre/movie/list' : '/genre/tv/list'
    const resolution = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&language=en-US`)
    const data = await resolution.json()
    return data.genres
}

async function fetchByGenre(genreId) {
    const endpoint = pageType === 'movie' ? '/discover/movie' : '/discover/tv'
    const resolution = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&language=en-US&with_genres=${genreId}&page=${randomPage()}`)
    const data = await resolution.json()
    return data.results
}

async function fetchTrailer(item) {
    const endpoint = item.isTV ? `/tv/${item.id}/videos` : `/movie/${item.id}/videos`
    const res = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&language=en-US`)
    const data = await res.json()
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    return trailer ? trailer.key : null
}

async function loadBrowsePage() {
    await loadHero()
    const genres = await fetchGenres()

    for (const genre of genres) {
        const results = await fetchByGenre(genre.id)
        if (results.length > 0) {
            const shaped = results.map(shapeItem)
            allItems = [...allItems, ...shaped]
            renderCategory(genre.name, results.map(shapeItem))
        }
    }
}

function shapeItem(item) {
    const isTV = item.media_type === 'tv' || (item.media_type === undefined && item.name !== undefined)
    return {
        id: item.id,
        isTV: isTV,
        title: isTV ? item.name : item.title,
        image: item.poster_path ? imageBase + item.poster_path : '',
        year: (item.release_date || item.first_air_date || '').slice(0, 4),
        rating: item.vote_average?.toFixed(1) || 'N/A',
        description: item.overview || ''
    }
}

async function loadHero() {
    const endpoint = pageType === 'movie' ? '/trending/movie/day' : '/trending/tv/day'
    const results = await fetchTMDB(endpoint)
    const item = results[Math.floor(Math.random() * results.length)]
    const shaped = shapeItem(item)

    currentItem = shaped

    const trailerKey = await fetchTrailer(shaped)

    const hero = document.createElement('div')
    hero.classList.add('hero-banner')

    hero.innerHTML = `
    <div class="hero-video-container">
        ${trailerKey ? `
            <iframe
                class="hero-video"
                src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen>
            </iframe>
        ` : `
            <img class="hero-image" src="https://image.tmdb.org/t/p/original${item.backdrop_path}" alt="${shaped.title}">
        `}
        <div class="hero-video-overlay"></div>
    </div>
    <div class="hero-content">
        <h1 class="hero-title">${shaped.title}</h1>
        <p class="hero-description">${shaped.description}</p>
        <button class="hero-play-button">
            <span class="material-symbols-outlined">play_arrow</span>
            Play
        </button>
    </div>
`

    const mainContainer = document.querySelector('.main-container')
    mainContainer.insertBefore(hero, categoriesContainer)

    const iframe = hero.querySelector('.hero-video')

    if (iframe) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
                } else {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
                }
            })
        }, { threshold: 0.3 })

        observer.observe(hero)
    }
}

function renderCategory(name, items) {
    const categoryElement = document.createElement('div')
    categoryElement.classList.add('category')

    categoryElement.innerHTML = `
        <h2 class="category-title">${name}</h2>
        <div class="movie-container">
            <button class="left-button">
                <span class="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <div class="movie-row"></div>
            <button class="right-button">
                <span class="material-symbols-outlined">arrow_forward_ios</span>
            </button>
        </div>
    `

    const movieRow = categoryElement.querySelector('.movie-row')

    items.forEach(item => {
        const img = document.createElement('img')
        img.src = item.image
        img.alt = item.title
        img.addEventListener('click', () => openMovieModal(item))
        movieRow.appendChild(img)
    })

    categoryElement.querySelector('.left-button').addEventListener('click', () => {
        movieRow.scrollLeft -= 1000
    })
    categoryElement.querySelector('.right-button').addEventListener('click', () => {
        movieRow.scrollLeft += 1000
    })

    function updateMask() {
        const atStart = movieRow.scrollLeft === 0
        const atEnd = movieRow.scrollLeft + movieRow.clientWidth >= movieRow.scrollWidth

        if (atStart) {
            movieRow.style.maskImage = 'linear-gradient(to right, black calc(100% - 50px), transparent)'
            movieRow.style.webkitMaskImage = 'linear-gradient(to right, black calc(100% - 50px), transparent)'
        } else if (atEnd) {
            movieRow.style.maskImage = 'linear-gradient(to right, transparent, black 50px)'
            movieRow.style.webkitMaskImage = 'linear-gradient(to right, transparent, black 50px)'
        } else {
            movieRow.style.maskImage = 'linear-gradient(to right, transparent, black 50px, black calc(100% - 50px), transparent)'
            movieRow.style.webkitMaskImage = 'linear-gradient(to right, transparent, black 50px, black calc(100% - 50px), transparent)'
        }
    }

    movieRow.addEventListener('scroll', updateMask)
    updateMask()

    categoriesContainer.appendChild(categoryElement)
}

searchButton.addEventListener('click', () => {
    searchBar.classList.add('show')
    searchContainer.classList.add('show')
    searchBar.focus()
})

document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target)) {
        searchBar.classList.remove('show')
        searchContainer.classList.remove('show')
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

closeModal.addEventListener('click', () => {
    modalOverlay.classList.remove('show')
    document.querySelector('.image-container').innerHTML = `<img class="modal-image" src="" alt="">`
})

document.querySelector('.play-button').addEventListener('click', async () => {
    const key = await fetchTrailer(currentItem)

    if (key) {
        const imageContainer = document.querySelector('.image-container')
        imageContainer.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${key}?autoplay=1"
                width="100%"
                height="500px"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen>
            </iframe>
        `
    } else {
        alert('No trailer available for this title')
    }
})

async function loadEpisodes(item, seasonNumber) {
    const res = await fetch(`${baseUrl}/tv/${item.id}/season/${seasonNumber}?api_key=${apiKey}`)
    const data = await res.json()

    const episodesList = document.querySelector('.episodes-list')
    episodesList.innerHTML = ''

    data.episodes.forEach(episode => {
        const episodeItem = document.createElement('div')
        episodeItem.classList.add('episode-item')

        episodeItem.innerHTML = `
            <img class="episode-thumbnail" src="${episode.still_path ? imageBase + episode.still_path : ''}" alt="${episode.name}">
            <div class="episode-info">
                <div class="episode-number">Episode ${episode.episode_number}</div>
                <div class="episode-name">${episode.name}</div>
                <div class="episode-overview">${episode.overview}</div>
            </div>
        `

        episodesList.appendChild(episodeItem)
    })
}

async function openMovieModal(item) {
    currentItem = item
    modalOverlay.classList.add('show')

    const modalImage = document.querySelector('.modal-image')

    modalTitle.textContent = item.title
    movieYear.textContent = item.year
    movieRating.textContent = `⭐ ${item.rating}`
    modalImage.src = item.image
    modalDescription.textContent = item.description

    const endpoint = item.isTV ? `/tv/${item.id}` : `/movie/${item.id}`
    const creditsEndpoint = item.isTV ? `/tv/${item.id}/credits` : `/movie/${item.id}/credits`

    const [details, credits] = await Promise.all([
        fetch(`${baseUrl}${endpoint}?api_key=${apiKey}`).then(r => r.json()),
        fetch(`${baseUrl}${creditsEndpoint}?api_key=${apiKey}`).then(r => r.json())
    ])

    const genres = details.genres.map(g => g.name).join(', ')
    const cast = credits.cast.slice(0, 5).map(c => c.name).join(', ')

    movieGenre.textContent = genres
    document.querySelector('.movie-cast').textContent = `Cast: ${cast}`

    const episodesContainer = document.querySelector('.episodes-container')
    const seasonSelect = document.querySelector('.season-select')

    if (item.isTV) {
        episodesContainer.classList.add('show')
        seasonSelect.innerHTML = ''

        details.seasons.forEach(season => {
            const option = document.createElement('option')
            option.value = season.season_number
            option.textContent = season.name
            seasonSelect.appendChild(option)
        })

        loadEpisodes(item, details.seasons[0].season_number)

        seasonSelect.onchange = () => {
            loadEpisodes(item, seasonSelect.value)
        }
    } else {
        episodesContainer.classList.remove('show')
        seasonSelect.innerHTML = ''
    }
}

function randomPage() {
    return Math.floor(Math.random() * 5) + 1
}

loadBrowsePage()