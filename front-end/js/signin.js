$(document).ready(function()  {
  'use strict'
  	/*Date of birth*/
	var sDateofBirth = $('input[name="dateofbirth"]'); 
	var container = $(".container").length > 0 ? $(".container").parent() : "body";
	var options = {
		format: "yyyy-mm-dd",
		container: container,
		todayHighlight: true,
		autoclose: true,
	};
	sDateofBirth.datepicker(options);	
	
	$("#formSignUp").on("submit", function (e) {
		e.preventDefault();
		console.log("clicked on sign up");
		console.log("going to : http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/user")
		var data = {
			FirstName: $("#inputFirstName").val(),
			LastName: $("#inputLastName").val(),
			Email: $("#inputEmailAddr").val(),
			Password: $("#inputPswd").val().toString(),
			DateOfBirth: $("#inputDateOfbirth").data().datepicker.getFormattedDate(),
			Gender: $("#inputGenderMale")[0].checked ? "m" : "f",
			Nationality: "IN"
		};
		$.ajax({
            type: "POST",
            url: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/user",
            data: JSON.stringify(data),
            success: function () {
				$('#formSignUp').get(0).reset();
                window.location = '"http://pennconnect.duckdns.org:8000"';
            },
			error: function(xhr, resp, text) {
				
			}
        });     
	});

	$("#formSignIn").on("submit", function (e) {
		e.preventDefault(); 
		var data = {
			email: $("#inputEmail").val(),
			password: $("#inputPassword").val().toString()
		};
		$.ajax({
            type: "POST",
            url: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/login",
            data: JSON.stringify(data),
            success: function () {
				$("#alert").hide();
				$('#formSignIn').get(0).reset();
                window.location = 'newsfeed.html';
            },
			error: function(xhr, resp, text) {
				$("#alert").show();
				console.log(resp);
				console.log(xhr);
				console.log(text);
			}
        });     
	});
});
