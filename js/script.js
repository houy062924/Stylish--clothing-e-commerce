let paging;
let nextPage;
let marketingSrc;
let productSrc;
let inputJson;
let pageLoaded;
let typeParam;
let currentSlideDiv;
let urlParams = new URLSearchParams(window.location.search);
let urlTag = urlParams.get("tag");
let userInput;
let searchUrl;



// Update homepage marketing campaign images

function slideshow() {
  marketingSrc = 'https://api.appworks-school.tw/api/1.0/marketing/campaigns';
  ajax(marketingSrc, function(response){
    renderSlideshow(response);
  });
}

slideshow();


// Search Function

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

  
  document.getElementsByClassName("contentCont")[0].innerHTML = "";

  userInput = document.getElementById("search").value;

  if ( userInput !== "" ) {

    searchUrl = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${userInput}`

    ajax(searchUrl, function(response){ 
      renderProducts(response); 
    });
  } else {

    ajax(productSrc, function(response){ 
      renderProducts(response); 
    });
  }
}


// Updating products

function getProducts(typeparam) {

  document.getElementsByClassName("contentCont")[0].innerHTML = "";
  typeParam = typeparam;
  paging = 0;
  productSrc = `https://api.appworks-school.tw/api/1.0/products/${typeParam}?paging=${paging}?tag=${typeParam}`;

  ajax(productSrc, function(response){ 
    renderProducts(response); 
  });

}


// Infinite Scroll

window.addEventListener("scroll",  function () {
  var d = document.documentElement;
  var offset = d.scrollTop + window.innerHeight;
  var height = d.offsetHeight-1;

  if (offset+200 >= height && nextPage !== undefined && pageLoaded === true) {
    paging = nextPage;

    if ( typeParam === undefined ) {
      productSrc = `https://api.appworks-school.tw/api/1.0/products/${urlTag}?paging=${paging}`;
    } else {
      productSrc = `https://api.appworks-school.tw/api/1.0/products/${typeParam}?paging=${paging}`;
    }
    
    ajax(productSrc, function(response){ 
      renderProducts(response); 
    });
  }
});


// Coming from different pages

if ( urlTag == "women" || urlTag == "men" || urlTag == "accessories" ) {
  productSrc = `https://api.appworks-school.tw/api/1.0/products/${urlTag}`;

  ajax(productSrc, function(response){ 
    renderProducts(response); 
  });

} else if ( urlTag === null ) {
  getProducts('all');
} else {
  searchUrl = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${urlTag}`

  ajax(searchUrl, function(response){ 
    renderProducts(response); 
  });
}


// Get cart stock

if ( JSON.parse(localStorage.getItem("totalQTY")) > 0 ) {
  document.getElementById("cartStock").style.visibility = "visible";
  document.getElementById("cartStockNum").innerHTML = JSON.parse(localStorage.getItem("totalQTY"))
}


// Ajax

function ajax (src, callback) {
  pageLoaded = false;
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if ( request.readyState === 4 && request.status === 200 ) {
      pageLoaded = true;
      callback(request);
    }
  };

  request.open("GET", src);
  request.send();
}


// Render marketing campaign slideshow

function renderSlideshow(response) {

  let inputImgs = JSON.parse(response.responseText);
  let i = 1;
  let textJson;
  let textParsed;

  // Rendering html

  let slideindicatordiv = document.createElement("div");
  slideindicatordiv.className = "indicatorCont";

  for ( let i=0; i<inputImgs.data.length; i++ ) {
    let welcomeimgdiv = document.createElement("div");
    welcomeimgdiv.className = "welcomeImgCont";

    let welcomeimg = document.createElement("img");
    welcomeimg.src = `https://api.appworks-school.tw/${inputImgs.data[i].picture}`;
    welcomeimg.className = "welcomeImg"

    textJson = inputImgs.data[i].story;
    textParsed = textJson.replace(/(?:\r\n|\r|\n)/g, '<br>');
    let welcometext = document.createElement("p");
    welcometext.innerHTML = textParsed;
    welcometext.className = "welcomeText";

    let slideindicator = document.createElement("div");
    slideindicator.className = "indicator";

    
    welcomeimgdiv.appendChild(welcomeimg);
    welcomeimgdiv.appendChild(welcometext);
    slideindicatordiv.appendChild(slideindicator);
    document.getElementsByClassName("welcomeCont")[0].appendChild(welcomeimgdiv);
    document.getElementsByClassName("welcomeCont")[0].appendChild(slideindicatordiv);
  }

  document.getElementsByClassName("welcomeImgCont")[0].id = "currentSlide";
  document.getElementsByClassName("indicator")[0].id = "currentIndicator";


  // Slideshow
  setInterval(timer, 10000);

  let n = 2

  function timer() {
    i = ( i + inputImgs.data.length ) % inputImgs.data.length;
    n = ( n + inputImgs.data.length ) % inputImgs.data.length;

    currentSlideDiv = document.getElementsByClassName("welcomeImgCont")[i];
    nextSlideDiv = document.getElementsByClassName("welcomeImgCont")[n];
    currentIndDiv = document.getElementsByClassName("indicator")[i];
    
    if ( document.getElementById('currentSlide') ) {
      document.getElementById('currentSlide').removeAttribute('id');
    };
    if ( document.getElementById('nextSlide') ) {
      document.getElementById('nextSlide').removeAttribute('id');
    };
    if ( document.getElementById('currentIndicator') ) {
      document.getElementById('currentIndicator').removeAttribute('id');
    };

    currentSlideDiv.id = "currentSlide";
    nextSlideDiv.id = "nextSlide";
    currentIndDiv.id = "currentIndicator";

    i++;
    n++;
  }
}


// Render product list 

function renderProducts(response) { 
  inputJson = JSON.parse(response.responseText);
  nextPage = inputJson.next_paging;
  
  for ( let i = 0; i < inputJson.data.length; i++) {

    // Create contentBox divs
    let productCont = document.createElement("div");
    document.getElementsByClassName("contentCont")[0].appendChild(productCont).className = "contentBox";

    // Access product images and add to contentBox
    let productImgs = document.createElement("img");
    productImgs.src = `${inputJson.data[i].main_image}`;
    productImgs.className = "itemImg";

    // Access product ids and create link
    let productLinkImg = document.createElement("a");
    productLinkImg.href = `product.html?id=${inputJson.data[i].id}`;
    productLinkImg.appendChild(productImgs);
    productCont.appendChild(productLinkImg)

    // Create contentBox divs
    let colorCont = document.createElement("div");
    productCont.appendChild(colorCont).className = "colorBoxCont";

    // Access color divs and add to contentBox
    for ( let c = 0; c < inputJson.data[i].colors.length; c++){
      let productColors = document.createElement("div");
      colorCont.appendChild(productColors).className = "colorBox";
      productColors.style.backgroundColor = `#${inputJson.data[i].colors[c].code}`;
    }

    // Access product names and add to contentBox
    let productLinkP = document.createElement("a");
    productLinkP.href = `product.html?id=${inputJson.data[i].id}`;

    let productNamesP = document.createElement("p");
    let productNames = document.createTextNode(`${inputJson.data[i].title}`);
    productNamesP.appendChild(productNames);

    productLinkP.appendChild(productNamesP).className = "productName";
    productCont.appendChild(productLinkP)

    // Access product prices and add to contentBox
    let productPricesP = document.createElement("p");
    let productPrices = document.createTextNode(`TWD.${inputJson.data[i].price}`);
    productPricesP.appendChild(productPrices);
    productCont.appendChild(productPricesP).className = "priceName";

  }
}
