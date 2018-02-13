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
