<?php
// index.php
// This is the main page of HagSpot
// We use session_start() to remember if the user is logged in
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link href="hagspotstyle.css" rel="stylesheet">
    <meta charset="UTF-8">
    <title>HagSpot | Augsburg University</title>
    <style>
        /* We added flexbox to the header so the buttons go to the right side */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }

        /* Style for the log in and register buttons */
        .header-buttons a {
            color: white;
            font-family: Arial, sans-serif;
            font-size: 15px;
            text-decoration: none;
            padding: 6px 14px;
            border: 2px solid white;
            border-radius: 4px;
            margin-left: 8px;
        }

        /* Buttons change color to red when you hover over them */
        .header-buttons a:hover {
            background: white;
            color: rgb(128,0,0);
        }

        /* Style for the message text when logged in */
        .header-buttons span {
            color: white;
            font-family: Arial, sans-serif;
        }
    </style>
</head>

<header>
    <div class="header-left">Augsburg University</div>

    <div class="header-buttons">
        <?php if (isset($_SESSION['user_name'])): ?>
            <!-- If the user is logged in show the log out button -->
            <a href="logout.php">Log out</a>
        <?php else: ?>
            <!-- If the user is not logged inshow log in and register buttons -->
            <a href="login.php">Log in</a>
            <a href="login.php?form=register">Register</a>
        <?php endif; ?>
    </div>
</header>

<nav>
    <a href="#">Home</a>
    <a href="#">View Spaces</a>
    <a href="#">Bookings</a>
    <a href="#">About</a>
</nav>

<!-- Show a message if login.php sent one (like "Wrong password") -->
<?php if (isset($_SESSION['msg'])): ?>
    <p style="background:#f8d7da; color:#721c24; padding:10px; text-align:center; font-family:Arial;">
        <?= $_SESSION['msg'] ?>
    </p>
    <?php unset($_SESSION['msg']); // delete message after showing it ?>
<?php endif; ?>

<main>
    <section class="hero">
        <h1>Welcome to HagSpot</h1>
        <p>
            Book study rooms, lab rooms, and meeting spaces inside the Hagfors Center here at Augsburg University.
            Checkout the map to see what areas are avaliable for booking.
        </p>
        <button>Browse Available Spaces</button>
    </section>

    <section class="spaces">
        <h2>Popular Spaces</h2>
        <div class="card-container">

            <div class="space-card">
                <h3>Study rooms on first floor 150-176</h3>
                <p>Capacity: 4-6 students</p>
                <p>Location: Hagfors Center</p>
                <button>View Availability</button>
            </div>

            <div class="space-card">
                <h3>Study rooms on second floor 250-276</h3>
                <p>Capacity: 4-6 students</p>
                <p>Location: Hagfors Center</p>
                <button>View Availability</button>
            </div>

            <div class="space-card">
                <h3>Study rooms on third floor 350-376</h3>
                <p>Capacity: 4-6 students</p>
                <p>Location: Hagfors Center</p>
                <button>View Availability</button>
            </div>

            <div class="space-card">
                <h3>Major Specific Study Rooms</h3>
                <p>Capacity: 8-10 students</p>
                <p>Location: Hagfors Center</p>
                <button>View Availability</button>
            </div>

            <div class="space-card">
                <h3>Extra Study areas</h3>
                <p>Capacity: 2-4 students</p>
                <p>Location: Hagfors Center</p>
                <button>View Availability</button>
            </div>

            <div class="space-card">
                <h3>Meeting Rooms</h3>
                <p>Capacity: 15-20 students or faculty</p>
                <p>Location: Hagfors Center</p>
                <button>View Availability</button>
            </div>

        </div>
    </section>
</main>

<footer>
    <p>HagSpot | Augsburg University Space Booking System</p>
</footer>

</body>
</html>