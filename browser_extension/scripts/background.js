// browser.browserAction.onClicked.addListener(async (info, tab) => {
//     chrome.tabs.create({url: 'index.html'});
//   });

let emailStatus = 'emailClosed';
let isListenerActive = false;

if (!isListenerActive) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("listener initialized")
    if (message.action === 'emailOpened') {
      // window.location.href = '/templates/detection_main.html';
      console.log('email opened redirector')
      emailStatus = 'emailOpened';
    } else if (message.action === 'emailClosed') {
      // window.location.href = '/templates/authenticate.html';
      console.log('email closed redirector')
      emailStatus = 'emailClosed'
    } else if (message.action === 'getEmailStatus' ) {
      console.log("get email status", emailStatus)
      sendResponse({ status: emailStatus });
    }
  });
  isListenerActive = true;
}


