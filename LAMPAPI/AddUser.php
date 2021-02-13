<?php
    $inData = getRequestInfo();

    // Create account fields
    $newUsername = $inData["newUsername"];
    $newPassword = $inData["newPassword"];
    $newPasswordConf = $inData["newPasswordConf"];

    // Check for blank username
    if($newUsername == "")
    {
        returnWithError("Please enter a username");
    }

    // Check for blank password
    if($newPassword == "")
    {
        returnWithError("Please enter a password");
    }

    // Check for blank password confirmation
    if($newPasswordConf == "")
    {
        returnWithError("Please confirm your password");
    }

    // Check if password and password confirmation match
    if(!strcmp($newPassword, $newPasswordConf))
    {
        returnWithError("Passwords do not match");
    }


    $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        // Check if username already exists
        $sql_u = "SELECT * FROM USERS WHERE username='$newUsername'";
        if(mysqli_query($conn, $sql_u) > 0)
        {
            returnWithError("Username already taken");
        }
        else
        {
            $sql = "insert into USERS(USERNAME, PASSWORD) values ('$newUsername','$newPassword')";
            if ($result = $conn->query($sql) != TRUE) {
                returnWithError($conn->error);
            }
        }
        $conn->close();
    }
    returnWithError(""); // Return with empty error, to signal account creation successful

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
