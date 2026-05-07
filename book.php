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
   echo json_encode([
      "success" => false,
      "message" => "Please log in first"
   ]);
   exit;
}

// Check if booking data exists
if (!isset($_POST['room'], $_POST['date'], $_POST['time'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing booking information"
    ]);
    exit;
}

//Get the data sent from the hagspot.js
$room = $_POST['room'];
$date = $_POST['date'];
$time = $_POST['time'];
$user = $_SESSION['user_name'];

// Insert booking into database
$sql = "INSERT INTO bookings (room, booking_date, time_slot, user_name)
VALUES ('$room', '$date', '$time', '$user')";

// Run query
if (mysqli_query($conn, $sql)) {

    echo json_encode([
        "success" => true,
        "message" => "Booking successful!"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}
?>