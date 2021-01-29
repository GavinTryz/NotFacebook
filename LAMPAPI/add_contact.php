<?php
/**
 * @var $conn
 */
    include('config/db_connect.php');
    //create account fields
    $username = $password = '';
    //create contact fields
    $firstname = $lastname = $email = $phone = $userid = '';

    //add contact
    $sql = "INSERT INTO CONTACTS(firstname, lastname, email, phone,userid) 
            VALUES('$firstname', '$lastname', '$email', '$phone', '$userid')";
    //save to DB
    if(mysqli_query($conn, $sql)){
        //if successful, redirect user to home page.
        header('Location: index.html');
    }else{
        echo 'Query Error: ' . mysqli_error($conn);
    }
