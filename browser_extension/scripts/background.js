// browser.browserAction.onClicked.addListener(async (info, tab) => {
//     chrome.tabs.create({url: 'index.html'});
//   });

let emailStatus = 'emailClosed';
let isListenerActive = false;

if (!isListenerActive) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("background.js: listener active")
    if (message.action === 'emailOpened') {
      // window.location.href = '/templates/detection_main.html';
      console.log('background.js: emailOpened received from content_script.js')
      emailStatus = 'emailOpened';
    } else if (message.action === 'emailClosed') {
      // window.location.href = '/templates/authenticate.html';
      console.log('background.js: emailClosed received from content_script.js')
      emailStatus = 'emailClosed'
    } else if (message.action === 'getEmailStatus' ) {
      console.log("background.js: getEmailStatus received from popup.js, sending response to popup.js", emailStatus)
      sendResponse({ status: emailStatus });
    }
  });
  isListenerActive = true;
}


