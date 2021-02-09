<?php
    $inData = getRequestInfo();

    $userId = $inData["id"];
    $contactFirstName = $inData["contactFirstName"];
    $contactLastName = $inData["contactLastName"];
    $contactLastName = $inData["contactLastName"];
    $contactEmail = $inData["contactEmail"];
    $contactPhone = $inData["contactPhone"];

    $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
    if($conn->connect_error)
    {
        returnWithError($conn->error);
    }
    else
    {
        $sql = "insert into CONTACTS (FIRSTNAME, LASTNAME, EMAIL, PHONE, USERID) VALUES ('$contactFirstName', '$contactLastName', '$contactEmail', '$contactPhone', '$userId')";
        if($result = $conn->query($sql) != TRUE)
        {
            returnWithError($conn->error);
        }
        $conn->close();
    }
    returnWithError(""); // Return with empty error, to signal contact addition successful

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}