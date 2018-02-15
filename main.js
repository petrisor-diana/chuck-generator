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
  jokeLine.classList.toggle("hidden");
  loadingLogo.classList.toggle("hidden");
  
  var myRequest = new XMLHttpRequest;

  myRequest.addEventListener("load", addJoke)

  
  myRequest.open("GET", "https://api.chucknorris.io/jokes/random");
  myRequest.send();
  
}

function addJoke(e) {
  loadingLogo.classList.toggle("hidden");
  jokeLine.classList.toggle("hidden");
 
  var myRequestAsText = e.srcElement.response;
  var myResponseAsAJSON = JSON.parse(myRequestAsText);
  jokeLine.innerHTML= myResponseAsAJSON.value;

  
    
}


var footer = document.getElementById("scrollEvent");

footer.addEventListener("scroll", onScroll);


var timeoutId
function onScroll() {
  clearTimeout(timeoutId)

  if (footer.clientWidth + footer.scrollLeft >= footer.scrollWidth * 0.9) {

    timeoutId = setTimeout(function () { log(true) }, 500);


  } else log(false);
}


