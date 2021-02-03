<?php
/**
 * @var $conn
 */

$inData = getRequestInfo();
//get first and last name of contact we want to delete.
$firstname = $inData["firstname"];
$lastname = $inData["lastname"];
//connect to DB
include('config/db_connect.php');

//check our connection to the DB
if ($conn->connect_error)
{
    returnWithError( $conn->connect_error );
}
else {
    //delete contact sql script
    $sql = "DELETE FROM CONTACTS WHERE FIRSTNAME = '$firstname' AND LASTNAME = '$lastname'";
    //execute deletion
    if (mysqli_query($conn, $sql)) {\
        //close connection to the DB
        mysqli_close($conn);
        //if successful, redirect user to home page.
        header('Location: index.html');
    } else {
        echo 'Query Error: ' . mysqli_error($conn);
    }
}
