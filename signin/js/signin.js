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
		console.log('clicked on sign up!');
		var data = {
			FirstName: $("#inputFirstName").val(),
			LastName: $("#inputLastName").val(),
			Email: $("#inputEmailAddr").val(),
			Password: $("#inputPswd").val().toString(),
			DateOfBirth: $("#inputDateOfbirth").data().datepicker.getDate(),
			Gender: $("#inputGenderMale")[0].checked ? "m" : "f"
		};
		console.log(data);
		$.ajax({
            type: "POST",
            url: "http://40.121.195.146:8000/api-gateway.php/penn-connect/user",
            data: data,
	    dataType: "json",
            success: function () {
                   console.log("user signed up!");
            },
	    error: function(xhr, resp, text) {
                    console.log(xhr, resp, text);
	    }


        });     
	});
});
