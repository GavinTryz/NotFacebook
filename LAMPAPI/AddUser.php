<?php
    $inData = getRequestInfo();

    // Create account fields
    $newUsername = $inData["newUsername"];
    $newPassword = $inData["newPassword"];
    $newPasswordConf = $inData["newPasswordConf"];
    if(!strcmp($newPassword, $newPasswordConf)){
        //todo GAVIN JSON THIS
        $passwordError = "Passwords do not match!";
    }
    $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $sql_u = "SELECT * FROM USERS WHERE username='$newUsername'";
        if(mysqli_query($conn, $sql_u) > 0){
            //todo GAVIN UR STRING
            //TODO GAVIN JSON THIS
            $username_error = "Username already taken.";
        }else {
            // todo Check for duplicate
            // todo Confirm password
            $sql = "insert into USERS(USERNAME, PASSWORD) values ('$newUsername','$newPassword')";
            //$sql = "insert into USERS (USERNAME, PASSWORD) values ('" . $newUsername . "', '" . $newPassword . "')";
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
