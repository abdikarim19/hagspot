/*
hagspot.js
Group: Emily Y Adonai B. Diana M. Abdikarim M. 
*/

const spaceCards = document.querySelectorAll('.space-card');

spaceCards.forEach(card => {
    const viewButton = card.querySelector('button');
    const roomName = card.querySelector('h3').innerText;

    // EVENT: When the user clicks "View Availability"
    viewButton.onclick = function() {
        console.log("User is viewing: " + roomName);
        
        // Disable the button so the user doesn't click it twice
        viewButton.disabled = true;
        viewButton.innerText = "Showing Times...";

        // Run the function to generate the time blocks inside this card
        displayTimeSlots(card, roomName);
    };
});