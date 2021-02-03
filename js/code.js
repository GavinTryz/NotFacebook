var urlBase = 'http://f4c3b00k.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var username = "";

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
	//password = md5(password);
	
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

function doCreateAcc()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var phoneNumber = document.getElementById("phoneNumber").value;

	document.getElementById("accountAddResult").innerHTML = "";

	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : ' + lastName + '", "email" : ' + email + '", "phoneNumber" : '+ phoneNumber + '}';
	var url = urlBase + 'AddAccount.' + extension; 

	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("accountAddResult").innerHTML = "Account has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("accountAddResult").innerHTML = err.message;
	}
}


function searchAccount()
{
	var srch = document.getElementById("contactSearch").value;
	document.getElementById("foundContacts").innerHTML = "";

	var accountList = "";

	var jsonPayload = '{"search" : "' + srch + '", " userId" : ' + userId + '}';
	var url = urlBase + '/searchAccount.' + extension;


	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("foundContacts").innerHTML = "Account(s) have been retrieved";
				var jsonObject = JSON.parse(xhr.responseText);

				for (var i = 0; i < jsonObject.results.length; i++)
				{
					accountList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1)
					{
						accountList += "<br />\r\n"
					}
				}
				document.getElementsByTagName("p")[0].innerHTML = accountList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("foundContacts").innerHTML = err.message;
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
	else
	{
		// Change elements on a page to correspond to the logged-in user.
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}

	return userId;
}