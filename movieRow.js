const movieRow = document.querySelector('.movie-row')
const leftButton = document.querySelector('.left-button')
const rightButton = document.querySelector('.right-button')

rightButton.addEventListener('click', () => {
    movieRow.scrollLeft += 500
})

leftButton.addEventListener('click', () => {
    movieRow.scrollLeft -= 500
})