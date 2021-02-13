<?php
    $inData = getRequestInfo();

    // Create account fields
    $newUsername = $inData["newUsername"];
    $newPassword = $inData["newPassword"];
    $newPasswordConf = $inData["newPasswordConf"];

    
    if($newUsername == "") // Check for blank username
    {
        returnWithError("Please enter a username");
    }
    else if($newPassword == "") // Check for blank password
    {
        returnWithError("Please enter a password");
    }
    else if($newPasswordConf == "") // Check for blank password confirmation
    {
        returnWithError("Please confirm your password");
    }
    else if($newPassword != $newPasswordConf) // Check if password and password confirmation match
    {
        returnWithError("Passwords do not match");
    }
    else if(strlen($newUsername) > 30)
    {
        returnWithError("Username cannot be greater than 30 characters");
    }
    else if(strlen($newPassword) > 50)
    {
        returnWithError("Password cannot be greater than 50 characters");
    }
    else
    {
        $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
        if ($conn->connect_error) 
        {
            returnWithError( $conn->connect_error );
        }
        else
        {
            // Check if username already exists
            $sql = "SELECT * FROM USERS WHERE USERNAME='$newUsername'";
            $result = $conn->query($sql);
            if($result->num_rows > 0)
            {
                returnWithError("Username already taken");
            }
            else
            {
                $sql = "insert into USERS(USERNAME, PASSWORD) values ('$newUsername','$newPassword')";
                if ($result = $conn->query($sql) != TRUE) {
                    returnWithError($conn->error);
                }
                else
                {
                    returnWithError(""); // Return with empty error, to signal account creation successful
                }
            }
            $conn->close();
        }
    }


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
