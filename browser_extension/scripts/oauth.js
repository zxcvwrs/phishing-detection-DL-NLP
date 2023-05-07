window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        if (token) {
            // window.location.href = 'second_view.html'
            storeAuthToken(token);
            getAuthToken();
        }
        console.log(token);
      });
    });
  };

function storeAuthToken(AuthToken) {
    chrome.storage.session.set({ AuthTokenKey: AuthToken }).then(() => {
        console.log("Value is set to " + AuthToken);
      });
}

function getAuthToken() {
    chrome.storage.session.get(["AuthTokenKey"]).then((result) => {
        return result.key
      });
}