<?php
    $inData = getRequestInfo();

    // Create account fields
    $newUsername = $inData["newUsername"];
    $newPassword = $inData["newPassword"];
    $newPasswordConf = $inData["newPasswordConf"];

    $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        // todo Check for duplicate
        // todo Confirm password
        $sql = "insert into USERS (USERNAME, PASSWORD) values ('" . $newUsername . "', '" . $newPassword . "')";
        if($result = $conn->query($sql) != TRUE)
        {
            returnWithError($conn->error);
        }
        $conn->close();
    }
    returnWithError(""); // Return with empty error, to signal account creation successful

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

    /*
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
                //close connection to the DB
                mysqli_close($conn);
                //if successful, redirect user to home page.
                header('Location: index.html');
            } else {
                $sql_error =  'Query Error: ' . mysqli_error($conn);
            }
        }
        $conn->close();
    }
    */
