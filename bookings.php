<?php
// bookings.php
// This file shows only the bookings/reservations
// made by the user that is currently logged in.

session_start();
require 'config.php';

// If the user is not logged in,
// send them back to the login page.
// This protects the bookings page so random users
// cannot see reservation information.
if (!isset($_SESSION['user_name'])) {
    header("Location: login.php");
    exit;
}

// Get the logged in user's name from the session.
// We saved this information during login.
$user = $_SESSION['user_name'];

// SQL query:
// Select all bookings that belong ONLY to the logged in user.
// We also organize them by date and time.
$sql = "SELECT * FROM bookings 
        WHERE user_name = '$user'
        ORDER BY booking_date DESC, time_slot ASC";

// Run the query and store the result.
$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Connect CSS styling file -->
    <link href="hagspotstyle.css" rel="stylesheet">
    <meta charset="UTF-8">

    <!-- Title shown on browser tab -->
    <title>My Bookings | HagSpot</title>
</head>

<body>

<!-- Header section -->
<header>

    <!-- Left side university title -->
    <div class="header-left">
        Augsburg University
    </div>

    <!-- Right side logout button -->
    <div class="header-right">
        <a href="logout.php">Log out</a>
    </div>

</header>

<!-- Navigation bar -->
<nav>
    <a href="index.html">Home</a>
    <a href="viewSpaces.html">View Spaces</a>
    <a href="bookings.php">Bookings</a>
    <a href="about.html">About</a>
</nav>

<main>

<!-- Main bookings section -->
<section class="spaces">

    <!-- Page title -->
    <h1>My Bookings</h1>

    <?php if (mysqli_num_rows($result) > 0): ?>

        <!-- 
        If the user HAS bookings,
        we display all reservations here.
        -->
        <div class="card-container">

            <?php while ($row = mysqli_fetch_assoc($result)): ?>

                <!-- Individual booking card -->
                <div class="space-card">

                    <!-- Room name -->
                    <h3><?php echo $row['room']; ?></h3>

                    <!-- Booking date -->
                    <p>
                        Date:
                        <?php echo $row['booking_date']; ?>
                    </p>

                    <!-- Reserved time slot -->
                    <p>
                        Time:
                        <?php echo $row['time_slot']; ?>
                    </p>

                    <!-- User who made reservation -->
                    <p>
                        Reserved by:
                        <?php echo $row['user_name']; ?>
                    </p>

                </div>

            <?php endwhile; ?>

        </div>

    <?php else: ?>

        <!-- 
        If the user has no reservations yet,
        show this message instead of empty cards.
        -->
        <p>You do not have any bookings yet.</p>

    <?php endif; ?>

</section>

</main>

<!-- Footer -->
<footer>
    <p> HagSpot | Augsburg University Space Booking System</p>
</footer>

</body>
</html>