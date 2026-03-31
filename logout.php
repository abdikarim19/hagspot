<?php
// logout.php
// This file logs the user out and sends them back to the Hagspot homepage

session_start();
session_destroy(); // forget everything in the session
header("Location: index.php");
exit;
?>