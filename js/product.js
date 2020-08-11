let amountNum = Number(document.getElementById("amount").innerHTML);
let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get('id');
let inputInfo;
let selectedColor;
let selectedColorName;
let selectedSize;
let selectedStock;
let menuType;
let list;
let totalqtyArr;
let totalqty;



// Checking stock
if ( JSON.parse(localStorage.getItem("totalQTY")) === null ) {
  list = [];
} else {
  list = JSON.parse(localStorage.getItem("list"));
}

// Remember user selections
function userSelections() {
  for ( let c = 0; c < inputInfo.data.colors.length; c++ ) {
    document.getElementsByClassName("colorInput")[c].addEventListener("click", function() {
      selectedColor = inputInfo.data.colors[c].code;
      selectedColorName = inputInfo.data.colors[c].name;

      totalStock();
    });
  }
  
  for (let s = 0; s < inputInfo.data.sizes.length; s++ ) {
    document.getElementsByClassName("sizeInput")[s].addEventListener("click", function() {
      selectedSize = inputInfo.data.sizes[s];
  
      totalStock();
    });
  }  
}

// Get stock amount from user selections
function totalStock() {

  for ( let i = 0; i < inputInfo.data.variants.length; i++ ) {
    if ( selectedColor === inputInfo.data.variants[i].color_code ) {

      if ( inputInfo.data.variants[i].stock === 0 ) {
        document.getElementById(`labelsize${inputInfo.data.variants[i].size}`).style.opacity = "0.3"; 
        document.getElementById(`size${inputInfo.data.variants[i].size}`).disabled = true;
      } else {
        document.getElementById("stockText").innerHTML = "";
        document.getElementById(`labelsize${inputInfo.data.variants[i].size}`).style.opacity = "1"; 
        document.getElementById(`size${inputInfo.data.variants[i].size}`).disabled = false;
      }

      if ( selectedSize === inputInfo.data.variants[i].size ) {
        
        selectedStock = inputInfo.data.variants[i].stock;

        document.getElementsByClassName("amountSelectorCont")[0].style.opacity = 1;
        document.getElementById("decrement").disabled = false;
        document.getElementById("increment").disabled = false;

        document.getElementById("addToCartButton").style.opacity = 1;
        document.getElementById("addToCartButton").disabled = false;

      }
    }
  }

  if ( amountNum > selectedStock ) {
    amountNum = selectedStock;
    document.getElementById("amount").innerHTML = amountNum;
    document.getElementById("increment").style.opacity = "0.15";
  }
  if ( amountNum < selectedStock ) {
    document.getElementById("increment").style.opacity = "1";
  }

}

// Amount button fucntions

function decrement() {
  if ( amountNum > 0 ) {
    amountNum--;
    document.getElementById("amount").innerHTML = amountNum;
  } 
  if ( amountNum === 0 ) {
    document.getElementById("decrement").style.opacity = "0.15";
  }
  if ( amountNum < selectedStock ) {
    document.getElementById("increment").style.opacity = "1";
  }
}

function increment() {
  
  if ( amountNum < selectedStock ) {
    amountNum++;
    document.getElementById("amount").innerHTML = amountNum;
  }
  if ( amountNum === selectedStock ) {
    document.getElementById("increment").style.opacity = "0.15";

  }
  if ( amountNum > 0 ) {
    document.getElementById("decrement").style.opacity = "1";
  }
  
}

// Get cart stock

if ( JSON.parse(localStorage.getItem("totalQTY")) > 0 ) {
  document.getElementById("cartStock").style.visibility = "visible";
  document.getElementById("cartStockNum").innerHTML = JSON.parse(localStorage.getItem("totalQTY"));
}


// Add to cart

function addToCart() {
  if ( selectedColor !== undefined && selectedSize !== undefined && amountNum !== 0 ) {

    let newObject = {
      id: inputInfo.data.id,
      name: inputInfo.data.title,
      price: inputInfo.data.price,
      color: {
        name: selectedColorName,
        code: selectedColor,
      },
      size: selectedSize,
      qty: amountNum,
      image: inputInfo.data.main_image,
      stock: selectedStock
    };

    let index = -1;

    for ( let i=0; i<list.length; i++ ) {
      if ( list[i].name === newObject.name && list[i].color.code === newObject.color.code && list[i].size === newObject.size ) {
        index = i;

        if ( ( list[i].qty + amountNum ) <= selectedStock ) {
          list[i].qty = list[i].qty + amountNum;
          document.getElementById("stockText").innerHTML = "";
          
        } 
        else if ( ( list[i].qty + amountNum ) > selectedStock ) {
          document.getElementById("stockText").innerHTML = `${selectedStock - list[i].qty} stock left. Please select ${selectedStock - list[i].qty} or less products.`;
          amountNum = selectedStock - list[i].qty;
          document.getElementById("amount").innerHTML = selectedStock - list[i].qty;
        }

      }
    }
    
    if ( index === -1 ) {
      list.push(newObject);
    }
    
    totalqtyArr = list.map(el => el.qty);
    totalqty = totalqtyArr.reduce((a,b) => a+b, 0);

    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("list", JSON.stringify(list));
      localStorage.setItem("totalQTY", totalqty);

      document.getElementById("cartStock").style.visibility = "visible";
      document.getElementById("cartStockNum").innerHTML = JSON.parse(localStorage.getItem("totalQTY"));
    }

  }
}


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


// Call product ids

ajax(`https://api.appworks-school.tw/api/1.0/products/details?id=${productId}`, function(response){
  renderProductDetails(response);
});


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

// Rendering data from correct product id
function renderProductDetails(response) {
  inputInfo = JSON.parse(response.responseText);


  // Access product image
  let productimg = document.createElement("img");
  productimg.src = inputInfo.data.main_image;
  productimg.className = "productImg";

  document.getElementsByClassName("productImgCont")[0].appendChild(productimg);

  // Access product details: title, id, price
  let productname = document.createElement("h2");
  productname.innerHTML = inputInfo.data.title;
  productname.className = "name";

  let productid = document.createElement("p");
  productid.innerHTML = inputInfo.data.id;
  productid.className = "number";

  let productprice = document.createElement("p");
  productprice.innerHTML = `TWD.${inputInfo.data.price}`;
  productprice.className = "price";

  let productbreak = document.createElement("hr");

  document.getElementsByClassName("productTitle")[0].appendChild(productname);
  document.getElementsByClassName("productTitle")[0].appendChild(productid);
  document.getElementsByClassName("productTitle")[0].appendChild(productprice);
  document.getElementsByClassName("productTitle")[0].appendChild(productbreak);

  // Access colors
  let colorform = document.createElement("form");
  colorform.className = "colorForm";

  for ( let i = 0; i < inputInfo.data.colors.length; i++ ) {
    
    let colorformcont = document.createElement("div");
    colorformcont.className = "colorFormCont";

    let colordiv = document.createElement("div");
    colordiv.className = "outerBorder";
    
    let colorinput = document.createElement("input");
    colorinput.type = "radio";
    colorinput.name = "color";
    colorinput.id = `color${i}`;
    colorinput.className = "colorInput";

    let colorlabel = document.createElement("label");
    colorlabel.setAttribute("for",`color${i}`);
    colorlabel.className = "colorLabel";
    colorlabel.style.backgroundColor = `#${inputInfo.data.colors[i].code}`;

    colorformcont.appendChild(colorinput);
    colorformcont.appendChild(colordiv);
    colorformcont.appendChild(colorlabel);

    colorform.appendChild(colorformcont);
    document.getElementsByClassName("colorCont")[0].appendChild(colorform);

  }

  // Access sizes
  let sizeform = document.createElement("form");
  sizeform.className = "sizeForm";

  for ( let i = 0; i < inputInfo.data.sizes.length; i++ ) {
    let sizeinput = document.createElement("input");
    sizeinput.type = "radio";
    sizeinput.name = "size";
    sizeinput.id = `size${inputInfo.data.sizes[i]}`;
    sizeinput.className = "sizeInput";

    let sizelabel = document.createElement("label");
    sizelabel.setAttribute("for",`size${inputInfo.data.sizes[i]}`);
    sizelabel.className = "sizeLabel";
    sizelabel.innerHTML = inputInfo.data.sizes[i];
    sizelabel.id = `labelsize${inputInfo.data.sizes[i]}`;

    sizeform.appendChild(sizeinput);
    sizeform.appendChild(sizelabel);

    document.getElementsByClassName("sizeCont")[0].appendChild(sizeform);
  }

  // Access product further details
  let productnote = document.createElement("p");
  productnote.innerHTML = inputInfo.data.note;

  let productdescription = document.createElement("p");
  descriptionJson = inputInfo.data.description;
  descriptionParsed = descriptionJson.replace(/(?:\r\n|\r|\n)/g, '<br>');
  productdescription.innerHTML = descriptionParsed;

  let productplace = document.createElement("p");
  productplace.innerHTML = `素材產地/ ${inputInfo.data.place}<br>加工產地/ ${inputInfo.data.place}`;


  document.getElementsByClassName("info")[0].appendChild(productnote);
  document.getElementsByClassName("info")[0].appendChild(productdescription);
  document.getElementsByClassName("info")[0].appendChild(productplace);

  // Access product descriptions and images
  for ( let i = 0; i < inputInfo.data.images.length; i++ ) {
    let productstory = document.createElement("p");
    productstory.innerHTML = inputInfo.data.story;
    productstory.className = "detailText";

    let productimages = document.createElement("img");
    productimages.src = inputInfo.data.images[i];
    productimages.className = "detailImg"
  
    document.getElementsByClassName("descriptionCont")[0].appendChild(productstory);
    document.getElementsByClassName("descriptionCont")[0].appendChild(productimages);

  }
  

  userSelections();
}
