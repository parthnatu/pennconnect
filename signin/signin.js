$(function () {
  'use strict'
  	/*Date of birth*/
	var sDateofBirth = $('input[name="dateofbirth"]'); 
	var container = $(".container").length > 0 ? $(".container").parent() : "body";
	var options = {
		format: "mm/dd/yyyy",
		container: container,
		todayHighlight: true,
		autoclose: true,
	};
	sDateofBirth.datepicker(options);	
	
	$("#formSignUp").on("submit", function (e) {
		var data = {
			FirstName: $("#inputFirstName").val(),
			LastName: $("#inputLastName").val(),
			Email: $("#inputEmailAddr").val(),
			Password: CryptoJS.SHA1($("#inputPswd").val()).toString(),
			DateOfBirth: $("#inputDateOfbirth").data().datepicker.viewDate,
			Gender: $("#inputGenderMale")[0].checked ? "Male" : "Female"
		};
		$.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function (data) {
                   
            }
        });     
	});
});