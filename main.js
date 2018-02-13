var nextJokeBtn = document.getElementById('jokeBtn')
var loadingLogo = document.getElementById('loadingAnim')
var jokeLine = document.getElementById('jokeText')


nextJokeBtn.addEventListener('click', onClick)

function onClick() {
    loadingLogo.classList.toggle('hidden')
    jokeLine.classList.toggle('hidden')
}




