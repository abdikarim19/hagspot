/*
hagspot.js
Group: Emily Y Adonai B. Diana M. Abdikarim M. 
*/
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
//const spaceCards = document.querySelectorAll('.space-card');

//spaceCards.forEach(card => {
    //const viewButton = card.querySelector('button');
    //const roomName = card.querySelector('h3').innerText;

    // EVENT: When the user clicks "View Availability"
    //viewButton.onclick = function() {
        //console.log("User is viewing: " + roomName);
        
        // Disable the button so the user doesn't click it twice
        //viewButton.disabled = true;
        //viewButton.innerText = "Showing Times...";

        // Run the function to generate the time blocks inside this card
        //displayTimeSlots(card, roomName);
    //};
//});


function bookSpace(button) {
  // This finds the space card where the clicked button is located.
  let card = button.parentElement;

  // This gets the time selected by the user from the dropdown menu.
  let time = card.querySelector(".time-select").value;

  // This gets the paragraph where we show messages to the user.
  let message = card.querySelector(".confirmation-message");

  // This gets the room/space name from the card title.
  let roomName = card.querySelector("h3").innerText;

  console.log("User clicked Reserve for: " + roomName);
  console.log("Selected time: " + time);

  if (time === "") {
    message.textContent = "Please select a time first.";
    return;
  }

  message.textContent = "Booking successful for " + time + "!";
  button.innerText = "Reserved";
  button.disabled = true;

  console.log("Booking confirmed for " + roomName + " at " + time);
}