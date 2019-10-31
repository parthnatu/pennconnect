$(function () {
	'use strict'
	var postsDisplayed = 0;
	var arrPostIds = [];
	//tinymeercat385@psu.edu
	//passwd
	$.ajax({
		type: "POST",
		url: getUrl().postids,
		success: function (e) {
			arrPostIds = e.body;
			getPostContent();
		},
		error: function (xhr, resp, text) {}
	});

	function getPostContent() {
		var data = {
			post_ids: []
		};
		if (postsDisplayed < arrPostIds.length - 1) {
			var total = postsDisplayed + 10;
			while (postsDisplayed < total) {
				data.post_ids.push(arrPostIds[postsDisplayed]);
				postsDisplayed = postsDisplayed + 1;
			}
			$.ajax({
				type: "POST",
				data: JSON.stringify(data),
				url: getUrl().postcontent,
				success: function (e) {
					e.body.forEach(function (item) {
						
						if(item.text != null && item.fname !=null && item.lname!=null){
							if (item.text.trim() != "") {
								$("#newsfeedCards")[0].appendChild(buildCard(item));
							}
						}
					});
				},
				error: function (xhr, resp, text) {}
			});
		}

	}

	$(window).scroll(function () {
		var nearToBottom = 100;
		if ($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) {
			getPostContent();
		}
	});
	
	$.ajax({
		type: "GET",
		url: getUrl().currentuser,
		success: function (e) {
			var userDetails = e.body;
			//$("#userCard")[0].appendChild(buildUserCard(userDetails));
			buildUserCard(userDetails);
		},
		error: function (xhr, resp, text) {}
	});
	
	function buildUserCard(userDetails) {
		//var customCardDiv = document.createElement('div');
		//customCardDiv.className = 'card customCard';
		var customCardHeaderDiv = document.createElement('div');
		customCardHeaderDiv.className = 'card-header text-center';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		img.src = 'https://randomuser.me/portraits/lego/4.jpg';
		img.style = 'height: 5rem; width: 5rem;';
		var cardHeaderTitle = document.createElement('h5');
		cardHeaderTitle.className = 'card-title';
		cardHeaderTitle.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.php?user_id=current-user\">"+userDetails.fname.charAt(0).toUpperCase() + userDetails.fname.slice(1) + " " + userDetails.lname.charAt(0).toUpperCase() + userDetails.lname.slice(1)+"</a>";
		var cardHeaderDesc = document.createElement('p');
		cardHeaderDesc.className = 'font-italic';
		cardHeaderDesc.style = 'font-size: 0.8rem;';
		cardHeaderDesc.innerHTML = userDetails.email;
		customCardHeaderDiv.appendChild(img);
		customCardHeaderDiv.appendChild(cardHeaderTitle);
		customCardHeaderDiv.appendChild(cardHeaderDesc);
		
		var customCardBodyDiv = document.createElement('div');
		customCardBodyDiv.className = 'card-body';
		
		var flexboxDiv = document.createElement('div');
		flexboxDiv.className = 'd-flex justify-content-between bg-white';
		var connectionsDiv = document.createElement('div');
		connectionsDiv.className = 'card-text font-weight-normal';
		connectionsDiv.innerHTML = 'Connections';
		var connectionsCountDiv = document.createElement('div');
		connectionsCountDiv.className = 'card-text font-weight-normal';
		connectionsCountDiv.innerHTML = userDetails.friend_count;;
		flexboxDiv.appendChild(connectionsDiv);
		flexboxDiv.appendChild(connectionsCountDiv);
		
		var innerDiv = document.createElement('div');
		var groupsLink = document.createElement('a');
		groupsLink.className = 'font-weight-normal';
		groupsLink.href = '#';
		groupsLink.innerHTML = 'Groups';
		var breakline = document.createElement('br');
		var eventsLink = document.createElement('a');
		eventsLink.className = 'font-weight-normal';
		eventsLink.href = '#';
		eventsLink.innerHTML = 'Events';
		innerDiv.appendChild(groupsLink);
		innerDiv.appendChild(breakline);
		innerDiv.appendChild(eventsLink);
		
		customCardBodyDiv.appendChild(flexboxDiv);
		customCardBodyDiv.appendChild(innerDiv);
		$("#userCard")[0].appendChild(customCardHeaderDiv);
		$("#userCard")[0].appendChild(customCardBodyDiv);
		//customCardDiv.appendChild(customCardHeaderDiv);
		//customCardDiv.appendChild(customCardBodyDiv);
		
		//return customCardDiv;
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
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.php?user_id="+carditem.user_id+"\">"+carditem.fname.charAt(0).toUpperCase() + carditem.fname.slice(1) + " " + carditem.lname.charAt(0).toUpperCase() + carditem.lname.slice(1)+"</a>";
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
			upvoteResultText.innerHTML = carditem.upvotes / 1000 + 'k people upvoted';
		} else {
			upvoteResultText.innerHTML = carditem.upvotes + ' people upvoted';
		}
		var downvoteResultText = document.createElement('div');
		downvoteResultText.className = 'font-weight-normal ml-3';
		downvoteResultText.innerHTML = carditem.downvotes + ' people downvoted';
		postResultDiv.appendChild(upvoteResultText);
		postResultDiv.appendChild(downvoteResultText);

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
	
	$('#friendNameLinkId').on('click', function(e) {
		
	});

	$('#createModalId').on('show.bs.modal', function (e) {
		var button = $(e.relatedTarget);
		var dataObj = button.data('post');
		var modal = $(this);
		modal.find('.modal-title').text('Create post');
	});

	$('#createPostBtn').on('click', function (e) {
		var postData = $('#postTextareaId').val();
		var d = new Date,
    			dformat = [d.getFullYear(), d.getMonth() + 1,
                    d.getDate()].join('-')+' '+
              		[d.getHours(),
               		d.getMinutes(),
               		d.getSeconds()].join(':');
		var data = {
			text: $('#postTextareaId').val(),
			timestamp: dformat
		};
		console.log(JSON.stringify(data));
		$.ajax({
			type: "POST",
			data: JSON.stringify(data),
			url: getUrl().createpost,
			success: function (e) {
			},
			error: function (xhr, resp, text) {

			}
		});
	});

	$("#logoutId").on('click', function (e) {
		var url = getUrl().logout;
		$.ajax({
			type: "POST",
			url: url,
			success: function (e) {
				location.href = "http://pennconnect.duckdns.org:8000"
			},
			error: function (xhr, resp, text) {

			}
		});
	});

	function getUrl() {
		var url = {
			postids: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/newsfeed",
			postcontent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/getpost",
			createpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/post",
			currentuser: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/current-user/",
			anotheruser: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/this-user/",
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout"
		};
		return url;
	}

});
