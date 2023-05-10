// browser.browserAction.onClicked.addListener(async (info, tab) => {
//     chrome.tabs.create({url: 'index.html'});
//   });

let emailStatus = 'emailClosed';
let isListenerActive = false;
let currentEmailId = null;

if (!isListenerActive) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("background.js: listener active")
    if (message.action === 'emailOpened') {
      // window.location.href = '/templates/detection_main.html';
      console.log('background.js: emailOpened received from content_script.js')
      emailStatus = 'emailOpened';
      currentEmailId = message.emailId;
    } else if (message.action === 'emailClosed') {
      // window.location.href = '/templates/authenticate.html';
      console.log('background.js: emailClosed received from content_script.js')
      emailStatus = 'emailClosed'
      currentEmailId = null;
    } else if (message.action === 'getEmailStatus' ) {
      console.log("background.js: getEmailStatus received from popup.js, sending response to popup.js", emailStatus)
      sendResponse({ status: emailStatus });
    } else if (message.action === 'callGmailApi') {
      if (currentEmailId) {
        console.log("background.js: callGmailApi received from detection_button.js, sending request to GmailAPI")
        sendReq(currentEmailId);
      } else {
        console.log("background.js: callGmailApi received from detection_button.js but emailId is null, aborting")
      }
    }
  });
  isListenerActive = true;
}

function sendReq(emailId) {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    fetch('https://www.googleapis.com/gmail/v1/users/me/messages/' + emailId, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => console.log(data['payload']['parts'][0]['body']['data']))
    .catch(error => console.error(error));
  })
}



