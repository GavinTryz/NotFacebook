<?php
/**
 * @var $conn
 */

    $inData = getRequestInfo();

    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $userId = $inData["userId"];
    include('config/db_connect.php');

    //create contact fields
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else {
        //add contact
        $sql = "INSERT INTO CONTACTS(FIRSTNAME, LASTNAME, EMAIL, PHONE,USERID) 
            VALUES('$firstname', '$lastname', '$email', '$phone', '$userId')";
        //save to DB
        if (mysqli_query($conn, $sql)) {
            //close connection to the DB
            mysqli_close($conn);
            //if successful, redirect user to home page.
            header('Location: index.html');
        } else {
            echo 'Query Error: ' . mysqli_error($conn);
        }
    }
