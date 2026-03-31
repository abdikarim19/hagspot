<?php
// config.php
// This file connects Hagspot website to the database
 
$conn = mysqli_connect("gondola.proxy.rlwy.net", "root", "tFQsrwKhvVfLmJsGMppfRmkzkkvDRghU", "railway", 54206);
 
// If the connection doesnt work as expected it will stop and show the error
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>