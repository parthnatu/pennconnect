$(function () {
	'use strict'
	var userProfileId = location.search.split('user_id=')[1];
	
	$.ajax({
		type: "POST",
		url: getUrl().userdetails,
		data: JSON.stringify({user_id : userProfileId}),
		success: function(e) {
			buildUserCard(e.body);
			document.getElementById ("btn-friend").addEventListener ("click", toggleFriend, false);
		},
		error: function (xhr, resp, text) {}
	});
	$.ajax({
		type: "POST",
		url: getUrl().usergroups,
		data: JSON.stringify({user_id : userProfileId}),
		success: function (e) {
			arrPostIds = e.body;
			getgroups();
		},
		error: function (xhr, resp, text) {
		}
	});

	function buildUserCard(data){
		var htmlContent = "<div class=\"card-header text-center\"><img class=\"rounded-circle\" src=\"https://randomuser.me/portraits/lego/4.jpg\" alt=\"Card image cap\" style=\"height: 5rem; width: 5rem;\" data-holder-rendered=\"true\"><h5 class=\"card-title\">"+data.fname.charAt(0).toUpperCase() + data.fname.substring(1)+ " "+data.lname.charAt(0).toUpperCase() + data.lname.substring(1)+"</h5>";
		var degree_type = data.degree_type;
		var degree_statement = "";
		if(degree_type == "MS"){
			degree_statement = "Student at Pennsylvania State University pursuing a MS Degree in";
		}
		else if(degree_type == "PHD"){
			degree_statement = "Student at Pennsylvania State University pursuing a PhD Degree in";
		}
		else if(degree_type == "UG"){
			degree_statement = "Student at Pennsylvania State University pursuing an Undergraduate Degree in";
		}
		else{
			degree_statement = "Student at Pennsylvania State University";
		}
		var grad_year = data.graduation_year;
		var year_stmnt = "Graduating in the year "+grad_year;
		var major = "";
		data.major.toLowerCase().split(" ").forEach(word => major+=word.charAt(0).toUpperCase() + word.substring(1)+" ");
		major = major.trim();
		htmlContent += "<p class=\"font-italic\" style=\"font-size: 0.8rem;\">"+degree_statement+" "+major+"</p>";
		htmlContent += "<p class=\"font-italic\" style=\"font-size: 0.8rem;\">"+year_stmnt+"</p>";
		var friend_status = data.friend_status;
		if(friend_status != null){
			if(friend_status){
				htmlContent += "<button id=\"btn-friend\" type=\"button\" onclick=\"toggleFriend()\" class=\"btn btn-success btn-sm\">Friends ✓</button>";
				
			}
			else{
				htmlContent += "<button id=\"btn-friend\" type=\"button\" onclick=\"toggleFriend()\" class=\"btn btn-danger btn-sm\">Friends x</button>";

			}
		}
		if(data.editable != null){
			if(data.editable){
				htmlContent += "<button type=\"button\" class=\"btn btn-secondary btn-sm\" href=\"ADD LINK TO EDIT FORM\">Edit</button>";
			}
		}
		htmlContent += "</div>";
		htmlContent += "<div class=\"card-body\"><div class=\"d-flex justify-content-between bg-white\"><div class=\"card-text font-weight-normal\">Connections</div><div class=\"card-text font-weight-normal\">"+data.friend_count+"</div></div><div><a href=\"#\" class=\"font-weight-normal\" href=\"ADD LINK TO GROUPS\">Groups</a><br/><a href=\"#\" class=\"font-weight-normal\">Events</a></div></div>"
		$("#userCard").append(htmlContent);


	}

	function getgroups() {
		var data = {
			group_ids: []
		};
			$.ajax({
				type: "POST",
				data: JSON.stringify(data),
				url: getUrl().listgroups,
				success: function (e) {
					console.log(e);
					var item;
					e.body.forEach(function (item) {
						if (item.text.trim() != "") {
							$("#groupCards")[0].appendChild(buildCard(item));
						}
					});
				},
				error: function (xhr, resp, text) {
					console.log("didnt work.")
				}
			});
		}

	}

	function buildCard(carditem) {
		var customCardDiv = document.createElement('div');
		customCardDiv.className = 'card customCard';
		var cardHeaderDiv = document.createElement('div');
		cardHeaderDiv.className = 'card-header';
		cardHeaderDiv.style = 'background-color: rgba(0,0,0,0);';
		var cardHeaderFlex = document.createElement('div');
		cardHeaderFlex.className = 'd-flex justify-content-start';
		var cardHeaderNameFlex = document.createElement('div');
		cardHeaderNameFlex.className = 'd-flex align-items-center ml-2';
		var nameLink = document.createElement('a');
		nameLink.id = "group_id";
		nameLink.className = 'card-text font-weight-normal';
		nameLink.innerHTML = carditem.group_name.charAt(0).toUpperCase() + carditem.group_name.slice(1);
		cardHeaderNameFlex.appendChild(nameLink);
		cardHeaderFlex.appendChild(cardHeaderNameFlex);
		cardHeaderDiv.appendChild(cardHeaderFlex);

		var cardBodyDiv = document.createElement('div');
		cardBodyDiv.className = 'card-body';
		var postadmin = document.createElement('h5');
		postadmin.className = 'card-text font-weight-normal mb-3';
		postadmin.innerHTML = carditem.admin_name;
		var postcreated = document.createElement('h5');
		postcreator.className = 'card-text font-weight-normal mb-3';
		postcreator.innerHTML = carditem.created_on;

		
		cardBodyDiv.appendChild(postadmin);
		cardBodyDiv.appendChild(postcreator);
		cardBodyDiv.appendChild(postResultDiv);
		cardBodyDiv.appendChild(postActionDiv);

		customCardDiv.appendChild(cardHeaderDiv);
		customCardDiv.appendChild(cardBodyDiv);
		customCardDiv.appendChild(cardFooterDiv);

		return customCardDiv;
	}

	$("#logoutId").on('click', function (e) {
		var url = getUrl().logout;
		$.ajax({
			type: "POST",
			url: url,
			success: function (e) {},
			error: function (xhr, resp, text) {

			}
		});
	});

	function getUrl() {
		var url = {
			postids: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/newsfeed",
			postcontent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/getpost",
			createpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/post",
			userdetails: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/userdetails",
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout",
			userposts: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/userposts",
			togglefriend : "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/toggle_friend",
			usergroups: "",
			listgroups: ""
		};
		return url;
	}
});
