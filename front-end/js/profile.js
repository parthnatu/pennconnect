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
			if (document.getElementById ("btn-friend") != null) {
				document.getElementById ("btn-friend").addEventListener ("click", toggleFriend, false);
			}
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

	$('#createGroupBtnId').on('click',function(e){
		var groupName = $('#groupNameId').val();
		$.ajax({
			type: "POST",
			data: JSON.stringify({group_name : groupName}),
			url: getUrl().creategroup,
			success: function (e) {
				$('#createGroupModal').modal('hide');
				alert('Group created!');
			},
			error: function (xhr, resp, text) {
			}
		});
	});
	
	$('#createEventBtnId').on('click',function(e){
		var eventName = $('#eventNameId').val();
		$.ajax({
			type: "POST",
			data: JSON.stringify({event_name : eventName}),
			url: getUrl().createevent,
			success: function (e) {
				$('#createEventModal').modal('hide');
				alert('Event created!');
			},
			error: function (xhr, resp, text) {
			}
		});
	});

	function navigateToEditForm(){
		window.location = '/edit_form.html';
	}

	function fillEditForm(userDetails) {
		$('#emailInputId').innerHTML = userDetails.email;
		$('#inputFirstName').innerHTML = userDetails.fname.charAt(0).toUpperCase() + userDetails.fname.slice(1);
		$('#inputLastName').innerHTML = userDetails.lname.charAt(0).toUpperCase() + userDetails.lname.slice(1);
		$('#inputGraduationYear').innerHTML = userDetails.graduation_year;
	}

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
				htmlContent += "<button id=\"editButtonId\" type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"navigateToEditForm()\">Edit</button>";
			}
		}
		htmlContent += "</div>";
		htmlContent += "<div class=\"card-body\"><div class=\"d-flex justify-content-between bg-white\"><div class=\"card-text font-weight-normal\">Connections</div><div class=\"card-text font-weight-normal\">"+data.friend_count+"</div>";
		if(userProfileId == -1){
			htmlContent += "</div><div><a href=\"http://pennconnect.duckdns.org:8000/usergroups.html?user_id=-1\" class=\"font-weight-normal\">Groups</a><br/>";
		}
		else{
			htmlContent += "</div><div><a href=\"http://pennconnect.duckdns.org:8000/usergroups.html?user_id="+userProfileId+"\" class=\"font-weight-normal\">Groups</a><br/>";
		}
		htmlContent += "<a href=\"#\" class=\"font-weight-normal\">Events</a></div></div>";
		$("#userCard").append(htmlContent);
		if (document.getElementById('editButtonId') != null) {
			document.getElementById('editButtonId').addEventListener('click', navigateToEditForm);
		}
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
						if(item.text){
							if (item.text.trim() != "") {
								$("#profileCards")[0].appendChild(buildCard(item));
							}
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
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?user_id="+carditem.user_id+"\">"+carditem.fname.charAt(0).toUpperCase() + carditem.fname.slice(1) + " " + carditem.lname.charAt(0).toUpperCase() + carditem.lname.slice(1)+"</a>";
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
		var upvoteResultText = document.createElement('div');
		upvoteResultText.className = 'font-weight-normal';
		if (carditem.upvotes >= 1000) {
			upvoteResultText.innerHTML = carditem.upvotes / 1000 + 'k people upvoted this';
		} else {
			upvoteResultText.innerHTML = carditem.upvotes + ' people upvoted this';
		}
		var downvoteResultLink = document.createElement('div');
		downvoteResultLink.className = 'font-weight-normal ml-3';
		if (carditem.downvotes >= 1000) {
			downvoteResultLink.innerHTML = carditem.downvotes / 1000 + 'k people downvoted this';
		} else {
			downvoteResultLink.innerHTML = carditem.downvotes + ' people downvoted this';
		}
		postResultDiv.appendChild(upvoteResultText);
		postResultDiv.appendChild(downvoteResultLink);

		var postActionDiv = document.createElement('div');
		postActionDiv.className = 'd-flex flex-row';
		var upvoteLink = document.createElement('a');
		upvoteLink.className = 'font-weight-normal';
		upvoteLink.href = '#';
		upvoteLink.innerHTML = 'Upvote'
		$(upvoteLink).data("upVotes", parseInt(carditem.upvotes));
		$(upvoteLink).data("postId", carditem.post_id);
		upvoteLink.addEventListener('click', function(e) {	
			e.preventDefault();	
			editPost(upvoteResultText, $(upvoteLink).data("postId"), "upvotes", $(upvoteLink));	
		});
		var downvoteLink = document.createElement('a');
		downvoteLink.className = 'font-weight-normal ml-3';
		downvoteLink.href = '#';
		downvoteLink.innerHTML = 'Downvote';
		$(downvoteLink).data("downVotes", parseInt(carditem.downvotes));
		$(downvoteLink).data("postId", carditem.post_id);
		downvoteLink.addEventListener('click', function(e) {
			e.preventDefault();		
			editPost(downvoteResultLink, $(downvoteLink).data("postId"), "downvotes", $(downvoteLink));	
		});
		postActionDiv.appendChild(upvoteLink);
		postActionDiv.appendChild(downvoteLink);

		cardBodyDiv.appendChild(postTextH);
		cardBodyDiv.appendChild(postResultDiv);
		cardBodyDiv.appendChild(postActionDiv);

		var cardFooterDiv = document.createElement('div');
		cardFooterDiv.className = 'card-header';
		cardFooterDiv.setAttribute("postId", carditem.post_id);
		getComments(carditem, cardFooterDiv);
		
		customCardDiv.appendChild(cardHeaderDiv);
		customCardDiv.appendChild(cardBodyDiv);
		customCardDiv.appendChild(cardFooterDiv);

		return customCardDiv;
	}
	function editPost(text, postId, edit_columns, voteLink) {
		var data = (edit_columns == "upvotes") ? {
			"post_id": parseInt(postId),
			"edit_columns": [edit_columns],
			"upvotes": voteLink.data("upVotes") + 1
		} : {
			"post_id": parseInt(postId),
			"edit_columns": [edit_columns],
			"downvotes": voteLink.data("downVotes") + 1
		};
		$.ajax({
			type: "POST",
			data: JSON.stringify(data),
			url: getUrl().editpost,
			success: function (e) {
				if (edit_columns === "upvotes") {
					voteLink.data("upVotes", voteLink.data("upVotes") + 1);
					text.innerHTML =  (voteLink.data("upVotes") >= 1000) ? voteLink.data("upVotes") / 1000 +
							"k people upvoted this": voteLink.data("upVotes") + " people upvoted this";
				} else {
					voteLink.data("downVotes", voteLink.data("downVotes") + 1);
					text.innerHTML =  (voteLink.data("downVotes") >= 1000) ? voteLink.data("downVotes") / 1000 +
							"k people downvoted this": voteLink.data("downVotes") + " people downvoted this";
				}
			},
			error: function (xhr, resp, text) {
				
			}
		});
	}
	
	function getComments(carditem, cardFooterDiv) {	
		$.ajax({
			type: "POST",
			data: JSON.stringify({"post_ids": [carditem.post_id]}),
			url: getUrl().getcomment,
			success: function (e) {
				var comments = e.body[0];
				if (comments.length > 2) {
					var viewMoreCommentsDiv = document.createElement('div');
					viewMoreCommentsDiv.className = 'd-flex justify-content-start mb-2';
					var viewMoreComments = document.createElement('a');
					viewMoreComments.style = "cursor: pointer;color:#007bff;";
					$(viewMoreComments).data("carditem", carditem);
					$(viewMoreComments).data("footerDiv", cardFooterDiv);
					viewMoreComments.addEventListener('click', function() {			
						getMoreComments($(viewMoreComments).data("carditem"), $(viewMoreComments).data("footerDiv"));
					});
					viewMoreComments.innerHTML = 'View more comments';
					viewMoreCommentsDiv.appendChild(viewMoreComments);
					cardFooterDiv.appendChild(viewMoreCommentsDiv);
				}
				var maxComments = comments.length >= 2 ? 2 : comments.length;
				for (var item = 0; item < maxComments; item++) {
					var commentBlock = createComments(comments[item]);
					cardFooterDiv.appendChild(commentBlock);
				}
				addNewCommentsBlock(carditem, cardFooterDiv);
			},
			error: function (xhr, resp, text) {
				
			}
		});
	}
	
	function getMoreComments(carditem, cardFooterDiv) {
		$.ajax({
			type: "POST",
			data: JSON.stringify({"post_ids": [carditem.post_id]}),
			url: getUrl().getcomment,
			success: function (e) {
				var comments = e.body[0];
				if (comments.length > 2) {
					cardFooterDiv.removeChild(cardFooterDiv.children[cardFooterDiv.children.length - 1]);
					for (var item = 2; item < comments.length; item++) {
						var commentBlock = createComments(comments[item]);
						cardFooterDiv.appendChild(commentBlock);
					}
					addNewCommentsBlock(carditem, cardFooterDiv);
				}
				cardFooterDiv.removeChild(cardFooterDiv.children[0]);
			},
			error: function (xhr, resp, text) {
				
			}
		});	
	}
	
	function addNewCommentsBlock(carditem, cardFooterDiv) {
		var cardFooterFlex = document.createElement('div');
		cardFooterFlex.className = 'd-flex justify-content-start';
		//cardFooterFlex.style = "align-items: center;";
		var cardFooterImg = document.createElement('img');
		cardFooterImg.className = 'rounded-circle';
		cardFooterImg.src = carditem.media_url;
		cardFooterImg.style = 'height: 3rem; width: 3rem;';
		var cardFooterFlexWithin = document.createElement('div');
		cardFooterFlexWithin.className = 'd-flex bd-highlight';
		cardFooterFlexWithin.style = "width: 100%;"
		var cardFooterInput = document.createElement('input');
		cardFooterInput.className = 'form-control form-control-lg p-2 w-100 bd-highlight ml-2';
		cardFooterInput.type = 'Text';
		cardFooterFlexWithin.appendChild(cardFooterInput);
		var sendButton = document.createElement('button');
		sendButton.className = "btn btn-primary p-2 flex-shrink-1 bd-highlight ml-2";
		sendButton.type = "submit";
		sendButton.innerHTML = "Post";
		$(sendButton).data("carditem", carditem);
		$(sendButton).data("footerDiv", cardFooterDiv);
		sendButton.addEventListener('click', function() {	
			var commentText = this.parentElement.children[0].value;	
			postComment(commentText, $(sendButton).data("carditem"), $(sendButton).data("footerDiv"));
		});
		cardFooterFlexWithin.appendChild(sendButton);
		cardFooterFlex.appendChild(cardFooterImg);
		cardFooterFlex.appendChild(cardFooterFlexWithin);
		cardFooterDiv.appendChild(cardFooterFlex);
	}
	
	function createComments(item) {
		var cardFooterFlexBig = document.createElement('div');
		cardFooterFlexBig.className = 'd-flex justify-content-start';
		var cardFooterImg = document.createElement('img');
		cardFooterImg.className = 'rounded-circle';
		cardFooterImg.src = "https://homepages.cae.wisc.edu/~ece533/images/airplane.png";
		cardFooterImg.style = 'height: 3rem; width: 3rem;';	
		var cardFooterFlexWithin = document.createElement('div');
		cardFooterFlexWithin.className = 'd-flex align-items-start flex-column';		
		var comment = document.createElement('h5');	
		comment.className = "card-text font-weight-normal ml-2";
		comment.style = 'font-size: 1rem;';
		var text = item.text;
		comment.innerHTML = JSON.parse(text.replace(/\bNaN\b/g, "null")).comment_text ? JSON.parse(text.replace(/\bNaN\b/g, "null")).comment_text : " ";
		var timestamp = document.createElement('p');
		timestamp.className = 'font-italic ml-2';
		timestamp.style = 'font-size: 0.7rem;';
		timestamp.innerHTML = item.timestamp;	
		cardFooterFlexWithin.appendChild(comment);
		cardFooterFlexWithin.appendChild(timestamp);	
		cardFooterFlexBig.appendChild(cardFooterImg);
		cardFooterFlexBig.appendChild(cardFooterFlexWithin);
		return cardFooterFlexBig;
	}
	
	function postComment(text, carditem, cardFooterDiv) {
		var d = new Date,
    		dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' ' +
              		[d.getHours(),
               		d.getMinutes(),
					   d.getSeconds()].join(':');
		var data = {
			"post_id": carditem.post_id,
			"text": JSON.stringify({
				"comment_text": text,
				"replies": []
			}),
			"timestamp": dformat
		};
		$.ajax({
			type: "POST",
			data: JSON.stringify(data),
			url: getUrl().createcomment,
			success: function (e) {
				cardFooterDiv.removeChild(cardFooterDiv.children[cardFooterDiv.children.length - 1]);
				var commentItem = {
					text: JSON.stringify({
						"comment_text": text,
						"replies": []
					}),
					timestamp: dformat
				};
				var commentBlock = createComments(commentItem);
				cardFooterDiv.appendChild(commentBlock);
				addNewCommentsBlock(carditem, cardFooterDiv);
			},
			error: function (xhr, resp, text) {

			}
		});
	} 

	$('#formSearch').on('submit', function(e) {
		e.preventDefault();
		var searchText = $('#searchInputId').val();
		$('#searchInputId').value = "";
		window.location = '/search.html?searchText=' + searchText;
	});

	$("#editform").on('click', function (e) {
		var url = getUrl().editform;
		$.ajax({
			type: "POST",
			url: url,
			success: function (e) {},
			error: function (xhr, resp, text) {

			}
		});
	});

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
			editform: "",                /*Add the link to the edit form*/
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout",
			userposts: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/userposts",
			togglefriend : "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/toggle_friend",
			creategroup: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/creategroup",
			getcomment: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/getcomment/",
			createcomment: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/create_comment/",
			editpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/editpost/",
		};
		return url;
	}
});
