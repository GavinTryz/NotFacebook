<?php
$conn = mysqli_connect("localhost", "root", "123NotPassword", "MASTER");
if(!$conn){
    echo 'Connection error: ' . mysqli_connect_error();
    //notify the website the database failed to load.
}