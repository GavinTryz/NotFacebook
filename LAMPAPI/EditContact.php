<?php
    $inData = getRequestInfo();

    $userId = $inData["id"];
    $contactId = $inData["contactId"];
    $contactFirstName = $inData["contactFirstName"];
    $contactLastName = $inData["contactLastName"];
    $contactLastName = $inData["contactLastName"];
    $contactEmail = $inData["contactEmail"];
    $contactPhone = $inData["contactPhone"];

    if($contactFirstName = "" && $contactLastName == "")
    {
        returnWithError("Contacts must have at least a first or last name");
    }

    $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
    if($conn->connect_error)
    {
        returnWithError($conn->error);
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
            // Update contact
            $sql = "update CONTACTS set FIRSTNAME = '$contactFirstName', LASTNAME = '$contactLastName', EMAIL = '$contactEmail', PHONE = '$contactPhone' where (ID = '$contactId' and USERID = $userId)";

            if($result = $conn->query($sql) != TRUE)
            {
                returnWithError($conn->error);
            }
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