let userInfo = JSON.parse(localStorage.getItem("usertoken"));


// Return to index page

function getProducts(typeParam) {
  window.location = `index.html?tag=${typeParam}`;
}


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


// Get cart stock

if ( JSON.parse(localStorage.getItem("totalQTY")) > 0 ) {
  document.getElementById("cartStock").style.visibility = "visible";
  document.getElementById("cartStockNum").innerHTML = JSON.parse(localStorage.getItem("totalQTY"));
}


// Render profile info

function renderProfile() {
  document.getElementById("userPhoto").setAttribute("src", userInfo.data.user.picture);
  document.getElementById("userName").innerHTML = userInfo.data.user.name;
  document.getElementById("userEmail").innerHTML = `Email: ${userInfo.data.user.email}`;
}

renderProfile();