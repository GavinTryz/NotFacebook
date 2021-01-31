<?php
$conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");

if(!$conn){
    echo 'Connection error: ' . mysqli_connect_error();
    //notify the website the database failed to load.
}