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
        $sql = "insert into USERS(USERNAME, PASSWORD) values ('$newUsername','$newPassword')";
        //$sql = "insert into USERS (USERNAME, PASSWORD) values ('" . $newUsername . "', '" . $newPassword . "')";
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
