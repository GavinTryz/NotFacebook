<?php
    $inData = getRequestInfo();

    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "API", "123NotPassword", "MASTER");
    if ($conn->connect_err)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // Search through first and last names that belong to the user. Parenthesis for unambiguity!
        $sql = "select * from CONTACTS where (FIRSTNAME like '%" . $inData["search"] . "%' or LASTNAME like '%" . $inData["search"] . "%') and USERID=" . $inData["id"];
        $result = $conn->query($sql);
        if ($result->num_rows > 0)
        {
            // Beginning of results JSON
            $searchResults .= '"resultCount" : ' . $result->num_rows . ',';
            $searchResults .= '"results" : [';

            // Cycle through results
            while($row = $result->fetch_assoc())
            {
                // Add comma before all but the first result
                if($searchCount > 0)
                {
                    $searchResults .= ",";
                }
                $searchCount++;

                // Write result
                $searchResults .= '{';
                $searchResults .= '"contactID" : ' . $row["ID"] . ', ';
                $searchResults .= '"contactFirstName" : "' . $row["FIRSTNAME"] . '", ';
                $searchResults .= '"contactLastName" : "' . $row["LASTNAME"] . '", ';
                $searchResults .= '"contactEmail" : "' . $row["EMAIL"] . '", ';
                $searchResults .= '"contactPhone" : "' . $row["PHONE"] . '", ';
                $searchResults .= '"contactDateCreated" : "' . $row["DATECREATED"] . '"';
                $searchResults .= '}';
            }

            // End of results JSON
            $searchResults .= ']';

            returnWithInfo($searchResults);
        }
        else
        {
            returnWithError("No contacts matching search");
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
		$retValue = '{"resultCount":0, "results":[], "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{' . $searchResults . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
