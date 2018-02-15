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

// Scroll functionality
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

// Save functionality
var saveBtn = document.getElementById("saveBtn");
var memeElement = document.getElementById("meme");

var currentImage = null;

saveBtn.addEventListener('click', onSave);

function onSave() {
  var myMeme = {
    text: jokeLine.innerHTML,
    img: currentImage
  };

  // We get the previously saved Memes
  var savedMemes = JSON.parse(localStorage.getItem('memes'));

  // localStorage.getItem
  // localStorage.setItem
  // localStorage.removeItem

  // If I don't have any previously saved memes, initialize the variable
  // to an empty array.
  if(!savedMemes) {
    savedMemes = [];
  } 

  // Add the currently saved meme to localstorage
  savedMemes.push(myMeme);

  // Add the currently saved meme to the page
  addMeme(myMeme);

  // Save to localStorage
  localStorage.setItem('memes', JSON.stringify(savedMemes));
}

function addMeme(meme) {
  mySecondPage.innerHTML += '<div class="bkgPhoto" style="background-image: url(' + meme.img + ')"><p class="jokeBackground">' + meme.text +'</p></div>'
}

// Select picture functionality
footer.addEventListener('click', function(e) {
  currentImage = e.srcElement.src;
  memeElement.style.backgroundImage = 'url("' + currentImage +'")'
});


// When opening the app show the saved memes
var mySavedMemes = JSON.parse(localStorage.getItem('memes'));

if(savedMemes){
  for(var i = 0; i< mySavedMemes.length; i++) {
    addMeme(mySavedMemes[i]);
  }
}

