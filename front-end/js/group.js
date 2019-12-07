$(function () {
	'use strict'
    var groupname = $('input[name="groupname"]');
    var description = $('input[name="description"]'); 
	var postsDisplayed = 0;
	var arrPostIds = [];
	//tinymeercat385@psu.edu
	//passwd
    
    $("#formcreategroup").on("submit", function (e) {
		e.preventDefault();
		console.log("clicked on create group");
		console.log("going to : "ADD LINK TO GROUP PROFILE")
		var data = {
			groupname: $("#inputgroupname").val(),
			description: $("#inputdescription").val(),
		};
		$.ajax({
            type: "POST",
            url: "ADD LINK TO GROUP PROFILE",
            data: JSON.stringify(data),
            success: function () {
				$('#formcreategroup').get(0).reset();
                window.location = '../group/group.html';
            },
			error: function(xhr, resp, text) {
				
			}
        });     
	});
    
	$.ajax({
		type: "POST",
		url: getUrl().get_group_posts,
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
				url: getUrl().get_group_post_data,
				success: function (e) {
					e.body.forEach(function (item) {
						if(item.text != null && item.fname !=null && item.lname!=null){
							if (item.text.trim() != "") {
								$("#groupCards")[0].appendChild(buildGroupCard(item));
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
		type: "POST",
		url: getUrl().groupdetails,
		data: JSON.stringify({group_id : -1 }),
		success: function (e) {
			var groupDetails = e.body;
			buildGroupCard(groupDetails);
		},
		error: function (xhr, resp, text) {}
	});
	
	function buildGroupCard(groupDetails) {
		var customCardHeaderDiv = document.createElement('div');
		customCardHeaderDiv.className = 'card-header text-center';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		img.src = 'https://randomuser.me/portraits/lego/4.jpg';
		img.style = 'height: 5rem; width: 5rem;';
		var cardHeaderTitle = document.createElement('h5');
		cardHeaderTitle.className = 'card-title';
		cardHeaderTitle.innerHTML = "<a href=\"ADD LINK FOR GROUP DETAILS">"+groupDetails.group_name.charAt(0).toUpperCase()"</a>";
		var cardHeaderDesc = document.createElement('p');
		cardHeaderDesc.className = 'font-italic';
		cardHeaderDesc.style = 'font-size: 0.8rem;';
		cardHeaderDesc.innerHTML = groupDetails.description;
        var member_status = groupDetails.member_status;
        var htmlContent;
		if(member_status != null){
			if(member_status){
				htmlContent += "<button id=\"btn-member\" type=\"button\" onclick=\"togglemembership()\" class=\"btn btn-success btn-sm\">Member ✓</button>";
				
			}
			else{
				htmlContent += "<button id=\"btn-member\" type=\"button\" onclick=\"togglemembership()\" class=\"btn btn-danger btn-sm\">Member x</button>";

			}
		}
        customCardHeaderDiv.appendChild(img);
		customCardHeaderDiv.appendChild(cardHeaderTitle);
		customCardHeaderDiv.appendChild(cardHeaderDesc);
		
		var customCardBodyDiv = document.createElement('div');
		customCardBodyDiv.className = 'card-body';
		
		var flexboxDiv = document.createElement('div');
		flexboxDiv.className = 'd-flex justify-content-between bg-white';
		var memberDiv = document.createElement('div');
		memberDiv.className = 'card-text font-weight-normal';
		memberDiv.innerHTML = 'Members';
		var memberCountDiv = document.createElement('div');
		memberCountDiv.className = 'card-text font-weight-normal';
		memberCountDiv.innerHTML = userDetails.member_count;;
		flexboxDiv.appendChild(memberDiv);
		flexboxDiv.appendChild(memberCountDiv);
		
		customCardBodyDiv.appendChild(flexboxDiv);
		customCardBodyDiv.appendChild(innerDiv);
		$("#groupCards")[0].appendChild(customCardHeaderDiv);
		$("#groupCards")[0].appendChild(customCardBodyDiv);	
        $("#groupCards").append(htmlContent);	
	}
    
    function togglemembership(){
		$.ajax({
			type: "POST",
			data: JSON.stringify({friend_user_id : group_id}),
			url: getUrl().togglemembership,
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
				$("#groupCards")[0].insertBefore(buildCard(item), $("#groupCards")[0].children[0]);
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
			get_group_posts: "",
            get_group_post_data: "",
			createpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/post",
			groupdetails: "",
            togglemembership: "",
			getcomment: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/getcomment/",
			createcomment: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/create_comment/",
			editpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/editpost/",
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout"
		};
		return url;
	}

});