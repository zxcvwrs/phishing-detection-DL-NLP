function fetchEmailId(element) {
    let emailItem = element.closest('bog');
    if (!emailItem) return null;
    const emailId = element.getAttribute('data-legacy-thread-id');
    return emailId;
}


function handleCheckbox(event) {
    console.log('click event')
    let target = event.target
    while (target) {
        if (target.getAttribute && target.getAttribute('aria-checked') == "true") {
          console.log('Checkbox clicked:', target);
          
          const emailId = fetchEmailId(target);

          console.log("EmailId", emailId);
          break;
        }
        if (target.getAttribute && target.getAttribute('aria-checked') == "false") {
            console.log('Checkbox unclicked:', target);
            break;
        }
        target = target.parentElement;
      }
    

    
}


window.addEventListener('click', handleCheckbox);