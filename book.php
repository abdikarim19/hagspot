<?php
//book.php
//This file receives the book information from the bookings.html
//and saves it in the railway database

session_start();
require 'config.php';

// This tell the browser that this file returns JSON (not HTML).
// This is important because our frontend uses fetch() and expects JSON.
// Then JavaScript can use response.json() to read the message we send back.
header("Content-Type: application/json");

//Check if the user is logged in
if(!isset($_SESSION['user_name'])) {
   echo json_encode(["message" => "Please log in first"]); 
   exit;
}

//Get the data sent from the hagspot.js
$room = $_POST['room'];
$date = $_POST['date'];
$time = $_POST['time'];
$user = $_SESSION['user_name'];

//Inset the booking into the database
$sql = "INSERT INTO bookings (room, booking_date, time_slot, user_name)
        VALUES ('$room', '$date', '$time', '$user')";

//Check if the booking worked
if (mysqli_query($conn, $sql)) {
    echo json_encode(["message" => "Booking successful"]);
} else {
    echo json_encode(["message" => "This time slot is already booked"]);
}

?>