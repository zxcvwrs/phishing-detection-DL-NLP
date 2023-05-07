window.onload = function() {
  checkAuthToken()
      .then(token => {
          console.log('Token', token)
          if (token) {
              redirectToDetectionPage();
              console.log('Token is already saved. This would be redirection.');
          } else {
            getAndSetAuthToken();
          }
      })
      .catch(error => {
          console.error("Error:", error);
      });
};

function redirectToDetectionPage() {
  window.location.href = "detection.html";
}

function checkAuthToken() {
  return new Promise((resolve, reject) => {
      chrome.storage.local.get(["AuthTokenKey"], (result) => {
        if (result) {
          resolve(result.AuthTokenKey);
        }
        else {
          reject(new Error('checkAuthToken error.'));
        }
      });
  });
}

function getAndSetAuthToken() {
  chrome.identity.getAuthToken({interactive: true}, (token) => {
      if (token) {
          setAuthToken(token)
              .then(() => {
                  redirectToDetectionPage();
                  console.log('Token stored', token);
              })
              .catch(error => {
                  console.error("Error:", error);
              });
      } else {
          console.log("getAndSetAuthToken returned empty token.");
      }
  });
}

function setAuthToken(AuthToken) {
  return new Promise((resolve, reject) => {
      chrome.storage.local.set({AuthTokenKey: AuthToken}, () => {
          console.log("Value is set to" + AuthToken);
          if (AuthToken) {
            resolve();
          }
          else {
            reject(new Error("storeAuthToken error."))
          }
      });
  });
}

