/*
hagspot.js
Group: Emily Y Adonai B. Diana M. Abdikarim M. 
*/
let slideIndex = 1;
showSlides(slideIndex);
let mapSlideIndex = 0;

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

  // Some pages use this shared file but do not have the homepage slideshow.
  if (slides.length === 0 || dots.length === 0) {
    return;
  }
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

// Shows one floor map at a time in the View Spaces carousel.
function showMapSlide(n) {
  let i;
  let mapSlides = document.getElementsByClassName("map-slide");
  let mapButtons = document.getElementsByClassName("map-floor-button");

  // If this page does not have maps, quietly skip the carousel setup.
  if (mapSlides.length === 0 || mapButtons.length === 0) {
    return;
  }

  // Wrap around so Previous on the first map goes to the third, and Next on the third goes to the first.
  if (n >= mapSlides.length) {mapSlideIndex = 0}
  if (n < 0) {mapSlideIndex = mapSlides.length - 1}

  // Clear the old active slide/button before showing the newly selected floor.
  for (i = 0; i < mapSlides.length; i++) {
    mapSlides[i].className = mapSlides[i].className.replace(" active", "");
  }

  for (i = 0; i < mapButtons.length; i++) {
    mapButtons[i].className = mapButtons[i].className.replace(" active", "");
  }

  mapSlides[mapSlideIndex].className += " active";
  mapButtons[mapSlideIndex].className += " active";
}

// Used by the Previous and Next buttons below the map.
function changeMapSlide(n) {
  showMapSlide(mapSlideIndex += n);
}

document.addEventListener("DOMContentLoaded", function() {
  let mapButtons = document.getElementsByClassName("map-floor-button");

  // The First/Second/Third buttons jump directly to a specific floor.
  for (let i = 0; i < mapButtons.length; i++) {
    mapButtons[i].onclick = function() {
      mapSlideIndex = i;
      showMapSlide(mapSlideIndex);
    };
  }
  showMapSlide(mapSlideIndex);
});
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

   // Get today's date automatically
  let today = new Date().toISOString().split("T")[0];

//Create a FormData object to send information to PHP
  let formData = new FormData();
// Add room name to the form data
  formData.append("room", roomName);
// Add booking date to the form data
  formData.append("date", today);
//Add selected time slot to the form data
  formData.append("time", time);

// Send the booking information to book.php
   fetch("book.php", {
    method: "POST",
    // Attach the form data
    body: formData
  })
  .then(response => response.text())
  .then(text => {
  console.log("PHP response:", text);
  let data = JSON.parse(text);
     // Show success or error message on the page
    message.textContent = data.message;

    if (data.success) {
      button.innerText = "Reserved";
      button.disabled = true;
    }
  })
  // If there is an error connecting to the server
  .catch(error => {
    // Show error message
    message.textContent = "Booking failed. Please try again.";
    console.log(error);
  });
}

  //console.log("User clicked Reserve for: " + roomName);
  //console.log("Selected time: " + time);

  //if (time === "") {
    //message.textContent = "Please select a time first.";
    //return;
  //}

  //message.textContent = "Booking successful for " + time + "!";
  //button.innerText = "Reserved";
  //button.disabled = true;

  //console.log("Booking confirmed for " + roomName + " at " + time);

