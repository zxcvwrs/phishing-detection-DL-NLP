chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('email_redirector')
    if (message.action === 'emailOpened') {
      window.location.href = '/templates/detection_main.html';
    } else if (message.action === 'emailClosed') {
      window.location.href = '/templates/authenticate.html';
    }
  });
  