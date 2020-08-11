let urlParams = new URLSearchParams(window.location.search);
let urlTag = urlParams.get("order");

displayOrderNum();


function displayOrderNum() {
  document.getElementById("orderNum").innerHTML = urlTag;
}

function getProducts(typeParam) {
  window.location = `index.html?tag=${typeParam}`;
}

function redirectPage() {
  window.location = "index.html";
}

localStorage.removeItem("list");
localStorage.removeItem("totalQTY");


// Search function 

window.addEventListener("resize", function() {
  if ( window.innerWidth > 992 ) {
    document.getElementById("search").style.display = "inline-block";
    document.getElementsByClassName("infoFormCont")[0].style.marginBottom = "0";
  } else if ( window.innerWidth < 992 ) {
    document.getElementById("search").style.display = "none";
  }
})

function searchFunc() {
  let displaystyle = window.getComputedStyle(document.getElementById("search")).getPropertyValue("display");

  if ( window.innerWidth < 992 && displaystyle === "none" ) {
    document.getElementById("search").style.display = "inline-block";
    document.getElementsByClassName("infoFormCont")[0].style.marginBottom = "-40px";
  } else if ( window.innerWidth < 992 && displaystyle === "inline-block" ) {
    document.getElementById("search").style.display = "none";
    document.getElementsByClassName("infoFormCont")[0].style.marginBottom = "0";
  }
  
  let userInput = document.getElementById("search").value;
  if ( userInput !== "" ) {
    window.location = `index.html?tag=${userInput}`;
  }
}
