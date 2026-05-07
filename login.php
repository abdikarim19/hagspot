<?php
// login.php
// This file does three things:
// 1. Shows the login form
// 2. Shows the register form
// 3. Handles both forms when they are submitted

session_start();
require 'config.php';


//Register form when is submitted

if (isset($_POST['register'])) {

    $name     = $_POST['full_name'];
    $email    = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); 

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['msg'] = "Invalid email format.";
        header("Location: login.php?form=register");
        exit;
    }

    // Restrict to Augsburg email
    if (!str_ends_with(strtolower($email), "augsburg.edu")){
        $_SESSION["msg"] = "You must use an Augsburg email";
        header("Location: login.php?form=register");
        exit;
    }

    // Check if domain exists (IN PROGRESS)
    $domain = substr(strrchr($email, "@"), 1);
    // Check if domain has mail exchange records
    if (!checkdnsrr($domain, "MX")) {
        $_SESSION['msg'] = "Email domain is not valid.";
        header("Location: login.php?form=register");
        exit;
    }
    // Save the new user in the database
    $sql = "INSERT INTO users (full_name, email, password) VALUES ('$name', '$email', '$password')";

    if (mysqli_query($conn, $sql)) {
        $_SESSION['msg'] = "Account created! Please log in.";
    } else {
        $_SESSION['msg'] = "That email is already registered.";
    }

    header("Location: login.php");
    exit;
}


//login form when is submitted

if (isset($_POST['login'])) {

    $email    = $_POST['email'];
    $password = $_POST['password'];

    // Find the user in the database
    $result = mysqli_query($conn, "SELECT * FROM users WHERE email = '$email'");
    $user   = mysqli_fetch_assoc($result);

    // Check if user exists and password is correct
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['msg'] = "Welcome, " . $user['full_name'] . "!";
        header("Location: index.php");
    } else {
        $_SESSION['msg'] = "Wrong email or password.";
        header("Location: login.php");
    }
    exit;
}

// Checking if the website should show the register form or the login form
// If the url is login.php?form=register we show register, otherwise login
$show = isset($_GET['form']) ? $_GET['form'] : 'login';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link href="hagspotstyle.css" rel="stylesheet">
    <meta charset="UTF-8">
    <title>HagSpot | Log In</title>
    <style>
        /* Center the form on the page */
        .form-box {
            width: 300px;
            margin: 60px auto;
            padding: 30px;
            border: 2px solid rgb(128,0,0);
            border-radius: 6px;
            background: white;
        }

        .form-box h2 {
            color: rgb(128,0,0);
            text-align: center;
            font-family: Arial, sans-serif;
            margin-bottom: 20px;
        }

        /* Style for the input fields */
        .form-box input {
            width: 100%;
            padding: 8px;
            margin-bottom: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        /* Style for the submit button */
        .form-box button {
            width: 100%;
            padding: 10px;
            background: rgb(128,0,0);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 15px;
            cursor: pointer;
        }

        .form-box button:hover { background: rgb(100,0,0); }

        .form-box p {
            text-align: center;
            font-size: 13px;
            color: #555;
            margin-top: 12px;
        }

        .form-box p a { color: rgb(128,0,0); }
    </style>
</head>
<body>

<header>
    <div class="header-left">Augsburg University</div>
</header>

<nav>
    <a href="index.html">Home</a>
    <a href="viewSpaces.html">View Spaces</a>
    <a href="bookings.php">Bookings</a>
    <a href="about.html">About</a>
</nav>

<!-- Show message if there is one (like "Wrong password") -->
<?php if (isset($_SESSION['msg'])): ?>
    <p style="background:#f8d7da; color:#721c24; padding:10px; text-align:center; font-family:Arial;">
        <?= $_SESSION['msg'] ?>
    </p>
    <?php unset($_SESSION['msg']); ?>
<?php endif; ?>

<?php if ($show == 'register'): ?>

    <!-- register form -->
    <div class="form-box">
        <h2>Register</h2>
        <form action="login.php" method="POST">
            <input type="text" name="full_name" placeholder="Full name" required>
            <input type="email" name="email" placeholder="email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name="register">Create account</button>
        </form>
        <p>Already have an account? <a href="login.php">Log in</a></p>
    </div>

<?php else: ?>

    <!-- login form -->
    <div class="form-box">
        <h2>Log In</h2>
        <form action="login.php" method="POST">
            <input type="email" name="email" placeholder="email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name="login">Log in</button>
        </form>
        <p>No account? <a href="login.php?form=register">Register here</a></p>
    </div>

<?php endif; ?>

</body>
</html>
