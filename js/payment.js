 TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');


TPDirect.card.setup({
  fields: {
    number: {
      element: '#card-number',
      placeholder: '**** **** **** ****'
    },
    expirationDate: {
      element: '#card-expiration-date',
      placeholder: 'MM / YY'
    },
    ccv: {
      element: '#card-ccv',
      placeholder: 'CCV'
    }
  },
  styles: {
    'input': {
      'color': 'black'
    },
    '.valid': {
      'color': 'green'
    },
    '.invalid': {
      'color': 'red',
    },
    '@media screen and (max-width: 400px)': {
      'input': {
        'color': 'black'
      }
    }
  }
});


TPDirect.card.onUpdate(function (update) {
  if (update.canGetPrime) {
    checkInputs();

  } else {
    document.getElementById("paymentConfirm").setAttribute('disabled', true);
  }
});


TPDirect.card.getTappayFieldsStatus();


function onSubmit() {
  // Get TapPay Fields status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // Check can getPrime
  if (tappayStatus.canGetPrime === false) {
    alert('Can not get prime');
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert('get prime error ' + result.msg);
      return;
    }

    sendCartData(result.card.prime);
  })
};

TPDirect.getFraudId()

// Ajax

function sendCartData(primecode) {
  let newObject = {
    prime: primecode,
    order: {
      shipping: "delivery",
      payment: "credit_card",
      subtotal: productsTotal,
      freight: 60,
      total: productsTotal + 60,
      recipient: {
        name: inputName,
        phone: inputMobile,
        email: inputEmail,
        address: inputAddress,
        time: inputDelivery
      },
      list: list
    }
  }

  ajax("https://api.appworks-school.tw/api/1.0/order/checkout", newObject);
};

let orderNumber;
let token = JSON.parse(localStorage.getItem("usertoken"));

function ajax (src, checkoutData) {
  const request = new XMLHttpRequest();

  request.open("POST", src);
  request.setRequestHeader("Content-Type", "application/json");

  if ( token !== null ) {
    request.setRequestHeader("Authorization", `Bearer ${token.data.access_token}`);
  }

  request.send(JSON.stringify(checkoutData));

  request.onreadystatechange = function () {
    if ( request.readyState !== 4 ) {
      console.log("running")
    }
    if ( request.readyState === 4 && request.status === 200 ) {
      let responseParsed = JSON.parse(this.responseText);
      orderNumber = responseParsed.data.number;

      window.location = `thankyou.html?order=${orderNumber}`;
    }
  };
};
