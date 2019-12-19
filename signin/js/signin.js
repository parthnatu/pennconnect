$(function () {
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
            url: getUrl().signup,
            data: JSON.stringify(data),
            success: function () {
				$('#formSignUp').get(0).reset();
                window.location = '../newsfeed/index.html';
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
		var url = 
		$.ajax({
            type: "POST",
            url: getUrl().login,
            data: JSON.stringify(data),
            success: function () {
				$("#alert").hide();
				$('#formSignIn').get(0).reset();
				//url = new URL(window.location.href)
				//url.searchParams.append("hello","1")
                window.location = '../newsfeed/index.html';
            },
			error: function(xhr, resp, text) {
				$("#alert").show();
			}
        });     
	});
	
	function getUrl() {
		var url = {
			login: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/login",
			signup: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/user"			
		};
		return url;
	}
});
