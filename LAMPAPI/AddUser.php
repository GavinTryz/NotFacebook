<?php
/**
 * @var $conn
 */

    include('config/db_connect.php');
    $inData = getRequestInfo();

    //create account fields
    $username = $inData["username"];
    $password = $inData["password"];

    //check if username already exists
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        //SQL SEARCH STRING
        $sql_u = "SELECT * FROM USERS WHERE username='$username'";
        if(mysqli_query($conn, $sql_u) > 0){
            //todo GAVIN UR STRING
            $username_error = "Username already taken.";
        }else {
            //add contact
            $sql_u_add = "INSERT INTO USERS(username, password) 
                VALUES('$username','$password')";
            //save to DB
            if (mysqli_query($conn, $sql_u_add)) {
                //if successful, redirect user to home page.
                header('Location: index.html');
            } else {
                //todo GAVIN UR STRING
                $sql_error =  'Query Error: ' . mysqli_error($conn);
            }
        }
        $conn->close();
    }

