
window.onload = function() {
    document.getElementById("myButton").addEventListener("click", function() {
    console.log('detection_button.js: this was clicked')
    chrome.runtime.sendMessage({action: "callGmailApi"});
});
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchedModelPrediction") {
        console.log("detection_button.js: got the prediction")
        // newInnerText = 'Prediction score: ' + request.predictionData.prediction;
        // document.getElementById("data").innerText = newInnerText
        // document.body.style.backgroundColor = 'blue';
        valueConverted = request.predictionData.prediction.toFixed(3) * 100
        checkPrediction(valueConverted)
    }
});

function checkPrediction(value) {
    var button = document.getElementById('myButton');
    var dataElement = document.getElementById("data");
    if (value >=0 && value <= 30) {
        newInnerText = 'Phishing score: Low (' + value + '%)';
        dataElement.innerText = newInnerText
        header_text = 'E-mail is ok. <br><br>'
        document.getElementById("emailOpened").innerHTML = header_text
        dataElement.margin = "-20px";
        document.body.style.backgroundColor = 'rgba(0, 255, 0, 0.25)';;
    }
    else if (value > 30 && value <= 60) {
        newInnerText = 'Phishing score: Medium (' + value + '%)';
        dataElement.innerText = newInnerText
        header_text = 'E-mail is suspicious. <br><br>'
        document.getElementById("emailOpened").innerHTML = header_text
        document.body.style.backgroundColor = 'rgba(255, 255, 0, 0.25)';
    } 
    else if (value > 60 && value <= 100) {
        newInnerText = 'Prediction score: High (' +  value + '%)';
        dataElement.innerText = newInnerText
        header_text = 'E-mail is highly suspicious. <br><br>'
        document.getElementById("emailOpened").innerHTML = header_text
        document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.25)';
    } 
}