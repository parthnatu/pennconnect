$(function () {
	'use strict'
	var userProfileId = location.search.split('user_id=')[1];
	var arrPostIds = null;
	var postsDisplayed = 0;
	var arrPostIds = [];
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
		url: getUrl().userposts,
		data: JSON.stringify({user_id : userProfileId}),
		success: function (e) {
			arrPostIds = e.body;
			getPostContent();
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
	function getPostContent() {
		var data = {
			post_ids: []
		};
		if (postsDisplayed < arrPostIds.length) {
			var total = postsDisplayed + 10;
			while (postsDisplayed < arrPostIds.length) {
				data.post_ids.push(arrPostIds[postsDisplayed]);
				console.log(data);
				postsDisplayed = postsDisplayed + 1;
			}
			$.ajax({
				type: "POST",
				data: JSON.stringify(data),
				url: getUrl().postcontent,
				success: function (e) {
					console.log(e);
					var item;
					e.body.forEach(function (item) {
						if (item.text.trim() != "") {
							$("#profileCards")[0].appendChild(buildCard(item));
						}
					});
				},
				error: function (xhr, resp, text) {
					console.log("didnt work.")
				}
			});
		}

	}

	$(window).scroll(function () {
		var nearToBottom = 100;
		if ($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) {
			getPostContent();
		}
	});
	function toggleFriend(){
		$.ajax({
			type: "POST",
			data: JSON.stringify({friend_user_id : userProfileId}),
			url: getUrl().togglefriend,
			success: function (e) {
				location.reload();
			}
		});
	}
	function buildCard(carditem) {
		var customCardDiv = document.createElement('div');
		customCardDiv.className = 'card customCard';
		var cardHeaderDiv = document.createElement('div');
		cardHeaderDiv.className = 'card-header';
		cardHeaderDiv.style = 'background-color: rgba(0,0,0,0);';
		var cardHeaderFlex = document.createElement('div');
		cardHeaderFlex.className = 'd-flex justify-content-start';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		var selected_number = Math.round(Math.random() * 9) + 1;
		img.src = "https://randomuser.me/portraits/lego/" + selected_number + ".jpg";
		img.style = 'height: 2rem; width: 2rem;';
		var cardHeaderNameFlex = document.createElement('div');
		cardHeaderNameFlex.className = 'd-flex align-items-center ml-2';
		var nameLink = document.createElement('a');
		nameLink.id = "friendNameLinkId";
		nameLink.className = 'card-text font-weight-normal';
		nameLink.innerHTML = carditem.fname.charAt(0).toUpperCase() + carditem.fname.slice(1) + " " + carditem.lname.charAt(0).toUpperCase() + carditem.lname.slice(1);
		cardHeaderNameFlex.appendChild(nameLink);
		cardHeaderFlex.appendChild(img);
		cardHeaderFlex.appendChild(cardHeaderNameFlex);
		cardHeaderDiv.appendChild(cardHeaderFlex);

		var cardBodyDiv = document.createElement('div');
		cardBodyDiv.className = 'card-body';
		var postTextH = document.createElement('h5');
		postTextH.className = 'card-text font-weight-normal mb-3';
		postTextH.innerHTML = carditem.text;

		var postResultDiv = document.createElement('div');
		postResultDiv.className = 'd-flex flex-row';
		var likeResultText = document.createElement('div');
		likeResultText.className = 'font-weight-normal';
		if (carditem.upvotes >= 1000) {
			likeResultText.innerHTML = carditem.upvotes / 1000 + 'k people liked this';
		} else {
			likeResultText.innerHTML = carditem.upvotes + ' people liked this';
		}
		var commentResultLink = document.createElement('div');
		commentResultLink.className = 'font-weight-normal ml-3';
		commentResultLink.innerHTML = carditem.downvotes + ' comments';
		postResultDiv.appendChild(likeResultText);
		postResultDiv.appendChild(commentResultLink);

		var postActionDiv = document.createElement('div');
		postActionDiv.className = 'd-flex flex-row';
		var upvoteLink = document.createElement('a');
		upvoteLink.className = 'font-weight-normal';
		upvoteLink.href = '#';
		upvoteLink.innerHTML = 'Upvote'
		var downvoteLink = document.createElement('a');
		downvoteLink.className = 'font-weight-normal ml-3';
		downvoteLink.href = '#';
		downvoteLink.innerHTML = 'Downvote';
		var commentLink = document.createElement('a');
		commentLink.className = 'font-weight-normal ml-3';
		commentLink.href = '#';
		commentLink.innerHTML = 'Comment';
		postActionDiv.appendChild(upvoteLink);
		postActionDiv.appendChild(downvoteLink);
		postActionDiv.appendChild(commentLink);

		cardBodyDiv.appendChild(postTextH);
		cardBodyDiv.appendChild(postResultDiv);
		cardBodyDiv.appendChild(postActionDiv);

		var cardFooterDiv = document.createElement('div');
		cardFooterDiv.className = 'card-header';
		var cardFooterFlex = document.createElement('div');
		cardFooterFlex.className = 'd-flex justify-content-start';
		var cardFooterImg = document.createElement('img');
		cardFooterImg.className = 'rounded-circle';
		cardFooterImg.src = carditem.media_url;
		cardFooterImg.style = 'height: 3rem; width: 3rem;';
		var cardFooterInput = document.createElement('input');
		cardFooterInput.className = 'form-control form-control-lg ml-2';
		cardFooterInput.type = 'Text';
		cardFooterInput.disabled = 'disabled';
		cardFooterFlex.appendChild(cardFooterImg);
		cardFooterFlex.appendChild(cardFooterInput);
		cardFooterDiv.appendChild(cardFooterFlex);

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
			togglefriend : "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/toggle_friend"
		};
		return url;
	}
});
