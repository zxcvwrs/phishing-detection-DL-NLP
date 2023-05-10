const targetNode = document.body;
const config = { childList: true, subtree: true };
let isEmailOpen = false;
let prevEmailId = null;

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const emailElement = document.querySelector("[data-message-id]");

      if (emailElement && emailElement.getAttribute("data-legacy-message-id") !== null) {
        const emailId = emailElement.getAttribute("data-legacy-message-id");
        // chrome.runtime.sendMessage({ emailId: emailId });
        if (emailId !== prevEmailId) {
            prevEmailId = emailId;
            isEmailOpen = true;
            console.log('content_script.js: email opened', emailId);
            chrome.runtime.sendMessage({action: 'emailOpened', emailId: emailId});
            console.log('content_script.js: emailOpened send to background.js');
        } 
    } else if (emailElement == null && isEmailOpen == true) {
        console.log('content_script.js: email closed')
        isEmailOpen = false;
        chrome.runtime.sendMessage({action: 'emailClosed'});
        console.log('content_script.js: emailClosed send to background.js');
    }
    }
    
  }
});


observer.observe(targetNode, config);