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
	/*********************************************************************************************
	var item = {
		fname: "Soundarya",
		lname: "Sundar",
		user_id: "123",
		text: "Hello have a nice day",
		upvotes: 123,
		downvotes: 23,
		media_url: "hfgsfg"	
	};
	$("#newsfeedCards")[0].appendChild(buildCard(item));
	*********************************************************************************************/
	$(window).scroll(function () {
		var nearToBottom = 100;
		if ($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) {
			getPostContent();
		}
	});
	
	$.ajax({
		type: "POST",
		url: getUrl().userdetails,
		data: JSON.stringify({user_id : -1 }),
		success: function (e) {
			var userDetails = e.body;
			buildUserCard(userDetails);
		},
		error: function (xhr, resp, text) {}
	});
	
	function buildUserCard(userDetails) {
		var customCardHeaderDiv = document.createElement('div');
		customCardHeaderDiv.className = 'card-header text-center';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		img.src = 'https://randomuser.me/portraits/lego/4.jpg';
		img.style = 'height: 5rem; width: 5rem;';
		var cardHeaderTitle = document.createElement('h5');
		cardHeaderTitle.className = 'card-title';
		cardHeaderTitle.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?user_id=-1\">"+userDetails.fname.charAt(0).toUpperCase() + userDetails.fname.slice(1) + " " + userDetails.lname.charAt(0).toUpperCase() + userDetails.lname.slice(1)+"</a>";
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
		cardFooterDiv.setAttribute("postId", carditem.post_id);
		getComments(carditem, cardFooterDiv);
		
		customCardDiv.appendChild(cardHeaderDiv);
		customCardDiv.appendChild(cardBodyDiv);
		customCardDiv.appendChild(cardFooterDiv);

		return customCardDiv;
	}
	
	function getComments(carditem, cardFooterDiv) {	
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
		$.ajax({
			type: "POST",
			data: JSON.stringify({"post_ids": [carditem.post_id]}),
			url: getUrl().getcomment,
			success: function (e) {
				var comments = e.body[0];
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
		comment.innerHTML = JSON.parse(text.replace(/\bNaN\b/g, "null")).comment_text !== null ? JSON.parse(text.replace(/\bNaN\b/g, "null")).comment_text : " ";
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
		//AJAX call to post comment using the postId (from footerDiv) and comment text
		cardFooterDiv.removeChild(cardFooterDiv.children[cardFooterDiv.children.length - 1]);
		var commentItem = {
			text: JSON.stringify({
				"comment_text": text,
				"replies": []
			}),
			timestamp: "timestamp to be returned"
		};
		var commentBlock = createComments(commentItem);
		cardFooterDiv.appendChild(commentBlock);
		addNewCommentsBlock(carditem, cardFooterDiv);
	} 

	$('#formSearch').on('submit', function(e) {
		e.preventDefault();
		var searchText = $('#searchInputId').val();
		//AJAX call for search
		window.location = '/search.html';
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
    			dformat = [d.getFullYear(),
			d.getMonth()+1,
                        d.getDate()].join('-')+' '+
              		[d.getHours(),
               		d.getMinutes(),
               		d.getSeconds()].join(':');
		var data = {
			text: $('#postTextareaId').val(),
			timestamp: dformat
		};
		$.ajax({
			type: "POST",
			data: JSON.stringify(data),
			url: getUrl().createpost,
			success: function (e) {
				$("#newsfeedCards")[0].insertBefore(buildCard(item), $("#newsfeedCards")[0].children[0]);
				$('#createModalId').modal('hide');
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
			userdetails: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/userdetails/",
			getcomment: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/getcomment/",
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout"
		};
		return url;
	}

});
