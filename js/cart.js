let list = JSON.parse(localStorage.getItem("list"));
let productsTotal = 0;
let acculPrice;
let inputName;
let inputMobile;
let inputEmail;
let inputAddress;
let inputDelivery;

renderPaymentAmount();
renderCartItems();

// Get cart stock

if ( JSON.parse(localStorage.getItem("totalQTY")) > 0 ) {
  document.getElementById("cartStock").style.visibility = "visible";
  document.getElementById("cartStockNum").innerHTML = JSON.parse(localStorage.getItem("totalQTY"));
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



// Functions

function changeQty(productID) {

  list[productID].qty = parseInt(`${document.getElementsByClassName("amountSelector")[productID].value}`, 10);

  let totalqtyArr = list.map(el => el.qty);
  let totalqty = totalqtyArr.reduce((a,b) => a+b, 0);

  localStorage.setItem("list", JSON.stringify(list));
  localStorage.setItem("totalQTY", totalqty);

  document.getElementById("cartStockNum").innerHTML = JSON.parse(localStorage.getItem("totalQTY"));

  renderCartItems();
  renderPaymentAmount();
}

function deleteItem(productID) {

  list.splice(productID, 1);

  let totalqtyArr = list.map(el => el.qty);
  let totalqty = totalqtyArr.reduce((a,b) => a+b, 0);

  localStorage.setItem("list", JSON.stringify(list));
  localStorage.setItem("totalQTY", totalqty);

  document.getElementById("cartStockNum").innerHTML = JSON.parse(localStorage.getItem("totalQTY"));

  renderCartItems();
  renderPaymentAmount();
}


function checkInputs() {
  let inputsStatus = checkInputsStatus();

  if( inputsStatus ){
    document.getElementById("paymentCont").style.display = "block"
  }
  updateConfirmStatus(inputsStatus, TPDirect.card.getTappayFieldsStatus().canGetPrime);
}

function checkInputsStatus() {
  inputName = document.getElementById("name").value.trim();
  inputMobile = document.getElementById("mobileNum").value.trim();
  inputEmail = document.getElementById("email").value.trim();
  inputAddress = document.getElementById("address").value.trim();

  let radios = document.getElementsByName("deliveryTime");
  
  for ( let i=0; i<radios.length; i++) {
    if ( radios[i].checked ) {
      inputDelivery = radios[i].value;
      break;
    }
  }

  return inputName.length !== 0 && inputMobile.length !== 0 && inputEmail.length !== 0 && inputAddress.length !== 0 && inputDelivery !== undefined;
}

function updateConfirmStatus( inputsStatus, cardStatus ){
  if ( inputsStatus === true && cardStatus === true ) {
    document.getElementById("paymentConfirm").removeAttribute('disabled');
  } else {
    document.getElementById("paymentConfirm").setAttribute('disabled', true);
  }
}

function renderPaymentAmount() {
  productsTotal = 0;

  if ( list !== null ) {
    for ( let i=0; i<list.length; i++ ) {
      productsTotal = productsTotal +  ( list[i].price * list[i].qty );
    }
  }

  if ( productsTotal !== 0 ) {
    document.getElementById("productsAmount").innerHTML = productsTotal;
    document.getElementById("totalAmount").innerHTML = productsTotal + 60;
  } else {
    document.getElementById("productsAmount").innerHTML = 0;
    document.getElementById("deliveryAmount").innerHTML = 0;
    document.getElementById("totalAmount").innerHTML = 0;
  }
}

function renderCartItems() {
  document.getElementsByClassName("cartItemsCont")[0].innerHTML = "";

  if ( list !== null ) {
    for ( let i=0; i<list.length; i++ ) {
      let cartitemcont = document.createElement("div");
      cartitemcont.className = "cartItemCont";

      // Render product images
      let productimgcont = document.createElement("div");
      productimgcont.className = "productImgCont";
      let productimg = document.createElement("img");
      productimg.src = list[i].image;
      productimg.className = "productImg";
      productimgcont.appendChild(productimg);

      // Render product info
      let productinfocont = document.createElement("div");
      productinfocont.className = "productInfoCont";

      let productname = document.createElement("p");
      productname.innerHTML = list[i].name;
      productname.className = "productName";

      let productid = document.createElement("p");
      productid.innerHTML = list[i].id;

      let colorsizecont = document.createElement("div");
      colorsizecont.className = "colorSizeCont";

      let producttitle = document.createElement("p");
      producttitle.className = "productTitle";
      producttitle.innerHTML = `顏色  |  ${list[i].color.name}`

      let productsize = document.createElement("p");
      productsize.className = "productTitle";
      productsize.innerHTML = `尺寸  |  ${list[i].size}`

      colorsizecont.appendChild(producttitle);
      colorsizecont.appendChild(productsize);

      // Render amount selector
      let amountcont = document.createElement("div");
      amountcont.className = "amountCont";
      let amountmobiletitle = document.createElement("p");
      amountmobiletitle.innerHTML = "數量";
      amountmobiletitle.className = "mobileTitle";

      let amountinput = document.createElement("input");
      amountinput.setAttribute("type", "number");
      amountinput.setAttribute("min", "1");
      amountinput.setAttribute("max", list[i].stock);
      amountinput.setAttribute("value", list[i].qty);
      amountinput.className = "amountSelector"
      amountinput.addEventListener("change", function() {
        changeQty(i);
      });
      amountcont.appendChild(amountmobiletitle);
      amountcont.appendChild(amountinput);

      // Render price for individal item
      let pricecont = document.createElement("div");
      pricecont.className = "priceCont";
      let pricemobiletitle = document.createElement("p");
      let pricetext = document.createElement("p");
      pricemobiletitle.innerHTML = "單價";
      pricemobiletitle.className = "mobileTitle";
      pricetext.innerHTML = `NT. ${list[i].price}`;
      pricetext.className = "priceText";
      pricecont.appendChild(pricemobiletitle);
      pricecont.appendChild(pricetext);


      // Render price for accul. items
      let acculpricecont = document.createElement("div");
      acculpricecont.className = "acculPriceCont";
      let acculpricemobiletitle = document.createElement("p");
      let acculpricetext = document.createElement("p");
      acculpricemobiletitle.innerHTML = "小計";
      acculpricemobiletitle.className = "mobileTitle";
      acculpricetext.innerHTML = `NT. ${list[i].price * list[i].qty}`;
      acculpricetext.className = "acculPriceText";
      acculpricecont.appendChild(acculpricemobiletitle);
      acculpricecont.appendChild(acculpricetext);

      // Render delete button
      let deletecont = document.createElement("a");
      deletecont.className = "deleteCont";

      let deleteicon = document.createElement("img");
      deleteicon.src = "css/images/cart-remove.png";
      deleteicon.addEventListener("click", function() {
        deleteItem(i);
      });
      deletecont.appendChild(deleteicon);

      productinfocont.appendChild(productname);
      productinfocont.appendChild(productid);
      productinfocont.appendChild(colorsizecont);

      cartitemcont.appendChild(productimgcont);
      cartitemcont.appendChild(productinfocont);
      cartitemcont.appendChild(amountcont);
      cartitemcont.appendChild(pricecont);
      cartitemcont.appendChild(acculpricecont);
      cartitemcont.appendChild(deletecont);

      document.getElementsByClassName("cartItemsCont")[0].appendChild(cartitemcont);
    }
  }
  
  if ( list === null || JSON.parse(localStorage.getItem("totalQTY")) === 0 ) {
    let cartmessagecont = document.createElement("div");
    cartmessagecont.className = "cartMessageCont";

    let cartmessage = document.createElement("p");
    cartmessage.innerHTML = "(購物車無產品)";
    cartmessage.className = "cartMessage";

    let cartmessagebutton = document.createElement("button");
    cartmessagebutton.className = "cartMessageButton";
    cartmessagebutton.innerHTML = "繼續選購";
    
    cartmessagecont.appendChild(cartmessage);
    cartmessagecont.appendChild(cartmessagebutton);

    document.getElementsByClassName("cartItemsCont")[0].appendChild(cartmessagecont);

    cartmessagebutton.addEventListener("click", function() {
      window.location = "index.html"
    });
  }
}
