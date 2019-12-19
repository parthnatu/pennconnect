$(function () {
    'use strict'

    $.ajax({
        type: "POST",
        url: getUrl().userdetails,
        data: JSON.stringify({user_id : -1}),
        success: function(e) {
            fillEditForm(e.body);
        },
        error: function (xhr, resp, text) {}
    });

    function fillEditForm(userDetails) {
		$('#emailInputId')[0].innerHTML = "Email: " + userDetails.email;
		$('#inputFirstName')[0].value = userDetails.fname.charAt(0).toUpperCase() + userDetails.fname.slice(1);
		$('#inputLastName')[0].value = userDetails.lname.charAt(0).toUpperCase() + userDetails.lname.slice(1);
		$('#inputGraduationYear')[0].value = userDetails.graduation_year;
    }
    
    $('#editProfile').on('submit', function(e) {
		e.preventDefault();
        var firstname = $('#inputFirstName').val();
        var lastname = $('#inputLastName').val();
        var gradyear = $('#inputGraduationYear').val();
        var data = {
            "edit_columns": ["lname", "fname", "graduation_year"],
            "lname": lastname,
            "fname": firstname,
            "graduation_year": gradyear
        };
        $.ajax({
            type: "POST",
            url: getUrl().editprofile,
            data: JSON.stringify(data),
            success: function(e) {
                alert("User details updated!");
            },
            error: function (xhr, resp, text) {}
        });
	});

    function getUrl() {
		var url = {
            userdetails: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/userdetails",
            editprofile: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/edit-profile",
            logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout",
            createpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/post",
            creategroup: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/creategroup"
        } 
        return url;
    }
    
});