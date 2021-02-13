<?php
    $inData = getRequestInfo();

    $userId = $inData["id"];
    $contactFirstName = $inData["contactFirstName"];
    $contactLastName = $inData["contactLastName"];
    $contactLastName = $inData["contactLastName"];
    $contactEmail = $inData["contactEmail"];
    $contactPhone = $inData["contactPhone"];

    if($contactFirstName == "" && $contactLastName == "")
    {
        returnWithError("Contacts must have at least a first or last name");
    }
    else if(strlen($contactFirstName) > 30 || strlen($contactLastName) > 30)
    {
        returnWithError("First and last names cannot be longer than 30 characters");
    }
    else if(strlen($contactEmail) > 320)
    {
        returnWithError("Email address cannot be longer than 320 characters");
    }
    else if(strlen($contactPhone) > 20)
    {
        returnWithError("Phone number cannot be longer than 20 characters");
    }
    else
    {
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
            else
            {
                returnWithError(""); // Return with empty error, to signal contact addition successful
            }
        }
        $conn->close();
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
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}