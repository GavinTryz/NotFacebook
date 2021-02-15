var urlBase = 'http://157.245.248.114/LAMPAPI';
var extension = 'php';

var userId = 0;
var username = "";


var currentEditContactId = "";


var array = new Array();

/*========================
		FRONT PAGE
========================*/
// EXECUTED ON LOAD
document.addEventListener("DOMContentLoaded", function() {
	$("#register-box").hide();
});

// CLEANSE INPUT
$(function() {
	// Login Username
	$("input#login-username").on({
		// When a new character was typed in
		keydown: function(e) {
			// 13 - ASCII for ENTER
			if (e.which === 13)
				return document.getElementById("login-submit").click();

			// 32 - ASCII for Space;
			if (e.which === 32)
				return false;
		},
		// When spaces managed to "sneak in" via copy/paste
		change: function() {
			// Regex-remove all spaces in the final value
			this.value = this.value.replace(/\s/g, "");
		}
	})

	// Register Username
	$("input#register-username").on({
		keydown: function(e) {
			if (e.which === 13)
				document.getElementById("register-submit").click();

			if (e.which === 32)
				return false;
		},
		change: function() {
			this.value = this.value.replace(/\s/g, "");
		}
	})

	// Login Password
	$("input#login-password").on({
		keydown: function(e) {
			if (e.which === 13)
				document.getElementById("login-submit").click();

			if (e.which === 32)
				return false;
		},
		change: function() {
			this.value = this.value.replace(/\s/g, "");
		}
	})

	// Register Password
	$("input#register-password").on({
		keydown: function(e) {
			if (e.which === 13)
				document.getElementById("register-submit").click();

			if (e.which === 32)
				return false;
		},
		change: function() {
			this.value = this.value.replace(/\s/g, "");
		}
	})

	// Register Password Confirmation
	$("input#register-password-confirm").on({
		keydown: function(e) {
			if (e.which === 13)
				document.getElementById("register-submit").click();

			if (e.which === 32)
				return false;
		},
		change: function() {
			this.value = this.value.replace(/\s/g, "");
		}
	})
});

// CHANGE TO REGISTER FORM
function registerForm()
{
	$("#login-box").hide();
	$("#register-box").show();
}

// CHANGE TO LOGIN FORM
function loginForm()
{
	$("#register-box").hide();
	$("#login-box").show();
}

/*========================
		LOGIN
========================*/

function doLogin()
{
	userId = 0;
	
	// Get username and password from HTML.
	var login = document.getElementById("login-username").value;
	var password = document.getElementById("login-password").value;
	password = md5(password);
	
	document.getElementById("login-error").innerHTML = "";

	// Format the payload and set up the connection.
	var jsonPayload = '{"username" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		// Send and recieve the payload.
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		
		userId = jsonObject.id;
		if (userId < 1)
		{
			document.getElementById("login-error").innerHTML = jsonObject.error;
			return;
		}
		
		username = login;

		saveCookie();
	
		window.location.href = "main.html";
	}
	catch(err)
	{
		document.getElementById("login-error").innerHTML = err.message;
	}
}

function doRegister()
{
	userId = 0;
	
	// Get username and password from register fields.
	var login = document.getElementById("register-username").value;
	var password = document.getElementById("register-password").value;
	var confirmPassword = document.getElementById("register-password-confirm").value;
	var tempPass = password;
	// Hash password for security.
	password = md5(password);
	confirmPassword = md5(confirmPassword);
	
	document.getElementById("register-error").innerHTML = "";

	// Check matching passwords
	if (password != confirmPassword)
	{
		document.getElementById("register-error").innerHTML = "Passwords do not match";
		return;
	}

	// Format the payload and set up the connection.
	var jsonPayload = '{ "newUsername" : "' + login + '", "newPassword" : "' + password + '", "newPasswordConf" : "' + confirmPassword + '" }';
	var url = urlBase + '/AddUser.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		// Send and recieve the payload.
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);

		// Check for error.
		if (jsonObject.error != "")
		{
			document.getElementById("login-error").innerHTML = jsonObject.error;
			return;
		}

		// Set fields.
		document.getElementById("login-username").value = login;
		document.getElementById("login-password").value = tempPass;
		doLogin();
	}
	catch(err)
	{
		document.getElementById("login-error").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "username=" + username + ",userId=" + userId + ";expires=" + date.toGMTString();
}

/*========================
		SEARCH PAGE
========================*/



function searchAccount()
{
	var srch = document.getElementById("contactSearch").value;
	document.getElementById("foundContacts").innerHTML = "";

	var jsonPayload = '{"search" : "' + srch + '", "id" : ' + userId + '}';
	var url = urlBase + '/SearchContact.' + extension;


	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
        
        var localArray = new Array(jsonObject.results.length);
        
        array = localArray;
        
        if (jsonObject.error == "")
        {
          document.getElementById("foundContacts").innerHTML = "Account(s) have been retrieved";
        }
        else
        {
          document.getElementById("foundContacts").innerHTML = jsonObject.error;
        }
        
        
        for (var i = 0; i < array.length; i++)
        {
          array[i] = new Array(6);
        }
        
        for (var i = 0; i < jsonObject.results.length; i++)
        {
          for (var j = 0; j < 6; j++)
          {
            if (j == 0)
            {
              array[i][j] = jsonObject.results[i].contactFirstName;
            }
            if (j == 1)
            {
              array[i][j] = jsonObject.results[i].contactLastName;
            }
            if (j == 2)
            {
              array[i][j] = jsonObject.results[i].contactEmail;
            }
            if (j == 3)
            {
              array[i][j] = jsonObject.results[i].contactPhone;
            }
            if (j == 4)
            {
              array[i][j] = jsonObject.results[i].contactID;
            }
            if (j == 5)
            {
              array[i][j] = i;
            }
          }
        }
  
        createTable(array);

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("foundContacts").innerHTML = err.message;
	}
}


function createTable(array) 
{
    var table = document.createElement('table');

    var rows = [];
    
    for (var i = 0; i < array.length; i++)
    {
      for (var j = 0; j < 4; j++)
      {
        if (j == 0)
        {
          rows[i] = array[i][0];
        }
        if (j == 1)
        {
          rows[i] = array[i][1];
        }
        if (j == 2)
        {
          rows[i] = array[i][2];
        }
        if (j == 3)
        {
          rows[i] = array[i][3];
        }
      }
    }
    
    var tableheader = "<table>";
    
    tableheader += "<th class='tableheader'>" + "First Name" + '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp' + "</th>";
    tableheader += "<th class='tableheader'>" + "Last Name" + '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp' + "</th>";
    tableheader += "<th class='tableheader'>" + "Email" + '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp' + "</th>";
    tableheader += "<th class='tableheader'>" + "Phone" + "</th>";
    
    tableheader += "</table>";
    document.getElementById("th").innerHTML = tableheader;
    
    
    var html = "<table class='ctable'>";
    
    
    for (var i = 0; i < array.length; i++) 
    {
      html+="<tr class='receivedbox'>";
      for (var j = 0; j < 4; j++)
      {
        if (j == 0)
        {
          html+= "<td>" + (i+1) + ")  " + array[i][j] + "</td>";
        }
        if (j == 1)
        {
          html+="<td>" + array[i][j] + "</td>";
        }
        if (j == 2)
        {
          html+="<td>" + array[i][j] + "</td>";
        }
        if (j == 3)
        {
          html+="<td>" + array[i][j] + '&nbsp &nbsp &nbsp' + "<input type='image' src='media/pencil.jpg' height='35px' class='editform' id='pencil' onclick='editContact(" + array[i][5] + ")';><input type='image' src='media/delete.jpg' height='35px' class='editform' id='trash' onclick='deleteContact(" + array[i][5] + ")';></td>";
        }
      }
      html+="</tr>";
      
    }
      
      html+="</table>";
      document.getElementById("box").innerHTML = html;
}

function editContact(row)
{
  var contactFirstName = array[row][0];
  var contactLastName = array[row][1];
  var contactEmail = array[row][2];
  var contactPhone = array[row][3];
  currentEditContactId = array[row][4];
  loadEdit();
  
  show(contactFirstName, contactLastName, contactEmail, contactPhone);
}

function loadEdit() 
{
  var x = document.getElementById("editbox");
  x.style.display = "block";
}

function hideEdit() 
{
  var x = document.getElementById("editbox");
  x.style.display = "none";
}

function show(contactFirstName, contactLastName, contactEmail, contactPhone)
{
  document.getElementById("editFirstName").value = contactFirstName;
  document.getElementById("editLastName").value = contactLastName;
  document.getElementById("editEmail").value = contactEmail;
  document.getElementById("editPhone").value = contactPhone;
}

function updateContact()
{

  var contactFirstName = "";
  var contactLastName = "";
  var contactEmail = "";
  var contactPhone = "";
  var contactId = currentEditContactId;
  
  
  if (document.getElementById("editFirstName").value != "")
  {
    contactFirstName = document.getElementById("editFirstName").value;
  }  
  if (document.getElementById("editLastName").value != "")
  {
    contactLastName = document.getElementById("editLastName").value;
  }
  if (document.getElementById("editEmail").value != "")
  {
    contactEmail = document.getElementById("editEmail").value;
  }
  if (document.getElementById("editPhone").value != "")
  {
    contactPhone = document.getElementById("editPhone").value;
  }

  document.getElementById("contactEditResult").innerHTML = "";

  var jsonPayload = '{"id" : "' + userId + '", "contactId" : "' + contactId + '", "contactFirstName" : "' + contactFirstName + '", "contactLastName" : "' + contactLastName + '", "contactEmail" : "' + contactEmail + '", "contactPhone" : "' + contactPhone + '"}';
	var url = urlBase + '/EditContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        var jsonObject = JSON.parse(xhr.responseText);
        
				if (jsonObject.error == "")
        {
          searchAccount();
          hideEdit();
        }
        else
        {
          document.getElementById("contactEditResult").innerHTML = jsonObject.error;
        }
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorEditResult").innerHTML = err.message;
	}
}

function addContact()
{

  var contactFirstName = "";
  var contactLastName = "";
  var contactEmail = "";
  var contactPhone = "";

  
  if (document.getElementById("contactFirstName").value != "")
  {
    contactFirstName = document.getElementById("contactFirstName").value;
  }
  if (document.getElementById("contactLastName").value != "")
  {
    contactLastName = document.getElementById("contactLastName").value;
  }
  if (document.getElementById("contactEmail").value != "")
  {
    contactEmail = document.getElementById("contactEmail").value;
  }
  if (document.getElementById("contactPhone").value != "")
  {
    contactPhone = document.getElementById("contactPhone").value;
  }
  
	document.getElementById("contactAddResult").innerHTML = "";
	
  var jsonPayload = '{"id" : "' + userId + '", "contactFirstName" : "' + contactFirstName + '", "contactLastName" : "' + contactLastName + '", "contactEmail" : "' + contactEmail + '", "contactPhone" : "' + contactPhone + '"}';
	var url = urlBase + '/AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        var jsonObject = JSON.parse(xhr.responseText);
        
				if (jsonObject.error == "")
        {
          document.getElementById("contactAddResult").innerHTML = "Contact has been added";
        }
        else
        {
          document.getElementById("contactAddResult").innerHTML = jsonObject.error;
        }
			}
      
      
      
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function deleteContact(row)
{

  if (confirm("Are you sure you want to delete this contact?") == true)
  {
    var contactId = array[row][4];
  
 	 //document.getElementById("contactDeleteResult").innerHTML = "";
  	
    var jsonPayload = '{"id" : "' + userId + '", "contactId" : ' + contactId + '}';
  	var url = urlBase + '/DeleteContact.' + extension;
  	
  	var xhr = new XMLHttpRequest();
  	xhr.open("POST", url, true);
  	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  	try
  	{
  		xhr.onreadystatechange = function() 
  		{
  			if (this.readyState == 4 && this.status == 200) 
  			{
  				//document.getElementById("contactDeleteResult").innerHTML = "Contact has been Deleted";
  			}
  		};
  		xhr.send(jsonPayload);
  	}
  	catch(err)
  	{
  		document.getElementById("colorAddResult").innerHTML = err.message;
  	}
  }
  else
  {
    return;
  }
  
}

function doLogout()
{
	userId = 0;
	username = "";
	document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

/*========================
		SHARED
========================*/

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
 

	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "username")
		{
			username = tokens[1];
		}
		else if (tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if (userId < 0)
	{
		return null;
	}

	return userId;
}