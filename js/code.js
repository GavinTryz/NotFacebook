var urlBase = 'http://COP4331-5.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

/*========================
		LOGIN PAGE
========================*/

// EXECUTED ON LOAD
document.addEventListener("DOMContentLoaded", function() {
	$("#register-box").hide();
});

// LOGIN USERNAME
$(function() {
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
});

// LOGIN PASSWORD
$(function() {
	$("input#login-password").on({
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
		SHARED
========================*/

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("login-error-text").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();
	
		window.location.href = "color.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
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
