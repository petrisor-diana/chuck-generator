function log(x) {
  console.log(x);
}

var myMenu = document.getElementById("menu");
var myFirstPage = document.getElementById("firstPage");
var mySecondPage = document.getElementById("secondPage");

myMenu.addEventListener("click", change);

function change() {
  myFirstPage.classList.toggle("hidden");
  mySecondPage.classList.toggle("hidden");
  myMenu.classList.toggle("open");
}
var nextJokeBtn = document.getElementById("jokeBtn");
var loadingLogo = document.getElementById("loadingAnim");
var jokeLine = document.getElementById("jokeText");

nextJokeBtn.addEventListener("click", onClick);

function onClick() {
  loadingLogo.classList.toggle("hidden");
  jokeLine.classList.toggle("hidden");
}

var footer = document.getElementById("scrollEvent");

footer.addEventListener("scroll", onScroll);


var timeoutId
function onScroll() {
  clearTimeout(timeoutId)

  if (footer.clientWidth + footer.scrollLeft >= footer.scrollWidth - footer.scrollWidth / 10) {
   
      timeoutId= setTimeout(function (){log(true)}, 500);
      
    
  } else log(false);
}


