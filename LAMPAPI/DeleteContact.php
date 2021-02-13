<?php
    $inData = getRequestInfo();
    $userId = $inData["id"];
    $contactId = $inData["contactId"];

    $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
		// Verify contact exists
		$sql = "select * from CONTACTS where USERID = '$userId' and ID = '$contactId'";
		$result = $conn->query($sql);
		if($result->num_rows < 1)
		{
			returnWithError("Contact not found (UserID: $userId, ContactID: $contactId)");
		}
		else
		{
			// Delete contact
			$sql = "delete from CONTACTS where USERID = '$userId' and ID = '$contactId'";
			if($result = $conn->query($sql) != TRUE)
			{
				returnWithError($conn->error);
			}
		}
        $conn->close();
    }
    returnWithError("");

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
