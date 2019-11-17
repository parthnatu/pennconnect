$(function () {
  'use strict'
    	var sGraduation = $('input[name="graduation"]'); 
	var container = $(".container").length > 0 ? $(".container").parent() : "body";
	var options = {
		format: "yyyy",
		container: container,
		todayHighlight: true,
		autoclose: true,
	};
	sGraduation.datepicker(options);
        
	$("#formEdit").on("submit", function (e) {
		e.preventDefault(); 
		var data = {
        
            		Graduation: $("#inputGradution").data().datepicker.getFormattedDate(),
			Major: $("#inputMajor").data(),
			About: $("#inputAbout").data()
		};
		$.ajax({
            type: "POST",
            url: getUrl().editform,
            data: JSON.stringify(data),
            success: function () {
				$('#formEdit').get(0).reset();
                		window.location = '../profile/user.html';
            },
			error: function(xhr, resp, text) {
				
			}
        });     
	});
	
    var postsDisplayed = 0;
	var arrPostIds = [];
    $.ajax({
		type: "POST",
		url: getUrl().postids,
		success: function (e) {
			arrPostIds = e.body;
			getPostContent();
		},
		error: function (xhr, resp, text) {}
	});
 
  o.forEach(function(item) {
    $("#profileCards")[0].appendChild(buildCard(item));
  }.bind(this));
 
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
					var item;
					e.body.forEach(function (item) {
						if (item.text.trim() != "") {
							$("#profileCards")[0].appendChild(buildCard(item));
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
			var userDetails = e.body.user;
			$("#userCard")[0].appendChild(buildUserCard(userDetails));
		},
		error: function (xhr, resp, text) {}
	});
    
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
	  	var EditLink = document.createElement('a');
		EditLink.className = 'font-weight-normal ml-3';
		EditLink.href = '#';
	  	EditLink.innerHTML = 'Edit'
		commentLink.innerHTML = 'Comment';
		postActionDiv.appendChild(upvoteLink);
		postActionDiv.appendChild(downvoteLink);
		postActionDiv.appendChild(commentLink);
	  	postActionDiv.appendChild(EditLink);

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
			currentuser: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/current-user/",
			anotheruser: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/this-user/",
            		editform: "",                /*Add the link to the edit form*/
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout"
		};
		return url;
	}
});
