document.getElementById("myButton").addEventListener("click", function() {
    console.log('detection_button.js: this was clicked')
    chrome.runtime.sendMessage({action: "callGmailApi"});
});
