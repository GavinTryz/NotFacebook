<?php
/**
 * @var $conn
 */

    include('config/db_connect.php');
    $inData = getRequestInfo();
    //get first and last name of contact we want to delete.
    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    //retrieves all columns
    $sql_s = "SELECT * FROM CONTACTS WHERE firstname='$firstname' 
                AND lastname='$lastname'";
    if ($result = mysqli_query($conn, $sql_s)) {
        //if successful, return contact information
        $information = mysqli_fetch_all($result, MYSQLI_ASSOC);

        mysqli_free_result($result);
        mysqli_close($conn);
    } else {
        $sql_error =  'Query Error: ' . mysqli_error($conn);
    }





