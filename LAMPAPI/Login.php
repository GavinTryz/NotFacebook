<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "root", "mysqlpass", "MASTER");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT ID FROM USERS where USERNAME='" . $inData["username"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
            $sql = "SELECT ID FROM USERS where USERNAME='" . $inData["username"] . "' and Password='" . $inData["password"] . "'";
            if ($result->num_rows > 0)
            {
                $row = $result->fetch_assoc();
                $id = $row["ID"];
                
                returnWithInfo($id);
            }
            else
            {
                returnWithError("Username not found");
            }
			
		}
		else
		{
			returnWithError("Username not found");
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
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>