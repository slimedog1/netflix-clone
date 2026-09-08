const movieRow = document.querySelector('.movie-row')
const leftButton = document.querySelector('.left-button')
const rightButton = document.querySelector('.right-button')

const modalOverlay = document.querySelector('.modal-overlay')
const modalTitle = document.querySelector('.modal-title')
const movieYear = document.querySelector('.movie-year')
const movieGenre = document.querySelector('.movie-genre')
const movieRating = document.querySelector('.movie-rating')
const modalImage = document.querySelector('.modal-image')

const closeModal = document.querySelector('.close-modal')

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

rightButton.addEventListener('click', () => {
    movieRow.scrollLeft += 500
})

leftButton.addEventListener('click', () => {
    movieRow.scrollLeft -= 500
})

movies.forEach(movie => {
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

        closeModal.addEventListener('click', () => {
            modalOverlay.classList.remove('show')
        })
    })

    movieRow.appendChild(image)
})


