
function statusChangeCallback(response) {

  if (response.status === 'connected') {
    window.location = "profile.html";

  } else {
    FB.login(function(response) {
      
      if (response.authResponse) {
        let userToken = {
          provider: "facebook",
          access_token: response.authResponse.accessToken,
        }

        ajaxLogin("https://api.appworks-school.tw/api/1.0/user/signin", userToken);

      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'public_profile, email'});
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '2835416863233681',
    cookie     : true,
    xfbml      : true,
    version    : 'v7.0'
  });
    
  FB.AppEvents.logPageView();       
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


// Ajax

function ajaxLogin (src, usertoken) {
  const request = new XMLHttpRequest();

  request.open("POST", src);
  request.setRequestHeader("Content-Type", "application/json");

  request.send(JSON.stringify(usertoken));

  request.onreadystatechange = function () {
    if ( request.readyState === 4 && request.status === 200 ) {
      localStorage.setItem("usertoken", this.responseText);
      window.location = "profile.html";
    }
  };
};
