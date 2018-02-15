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
  jokeLine.innerHTML = myResponseAsAJSON.value;
}

var footer = document.getElementById("scrollEvent");

footer.addEventListener("scroll", onScroll);

var timeoutId
var nr=2;
var footerImg=document.getElementById("imageGallery");
function onScroll() {
  clearTimeout(timeoutId)

  if (footer.clientWidth + footer.scrollLeft >= footer.scrollWidth * 0.9) {

    timeoutId = setTimeout(function () {
     
      getPhotos(nr);
      nr++;
    }, 500);
  } else log(false);
}

var footerSpinner = document.getElementById("footerLoading");

function getPhotos(nr) {
  var myRequest = new XMLHttpRequest;
  myRequest.addEventListener("load", function onLoad(e) {
    footerSpinner.classList.add("hidden");
    var myResponseAsText = e.srcElement.response;
    var myResponseAsAJSON = JSON.parse(myResponseAsText);
    addPhotos(myResponseAsAJSON)
  });
  myRequest.open("GET", "https://api.unsplash.com/photos/?page=" + nr + "&client_id=7551d068496476ab2e350913e3753a914f3ac6b83c12784e8cfc9c2a518cb1f8");
  myRequest.send();
  footerSpinner.classList.remove("hidden");
};

function addPhotos(list) {
  for (var i = 0; i < list.length; i++) {
    footerImg.innerHTML += "<img src=" + list[i].urls.regular + "/>";
  }
};

getPhotos(1)
