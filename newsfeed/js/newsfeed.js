$(function () {
	'use strict'
	var postsDisplayed = 0;
	var arrPostIds = [];
	//To get the post ids
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
					var item;
					console.log(e.body);
					//var postContents = JSON.parse(e.body);
					e.body.forEach(function (item) {
						if(item.text.trim() != ""){
							$("#newsfeedCards")[0].appendChild(buildCard(item));
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
	/*  var o = [{
	       src: "http://homepages.cae.wisc.edu/~ece533/images/girl.png",
	       name: "Soundarya Nurani Sundareswara",
	       desc: "Graduate Student at Pennsylvania State university",
		   post: "Good Morning!!"
	  }, {
	       src: "http://homepages.cae.wisc.edu/~ece533/images/girl.png",
	       name: "Wang-Chien Lee",
	       desc: "Professor at Pennsylvania State University",
		   post: "Please note: Assignment is due on 10/24"
	  }];*/
	  
	/*  var o = [{
	       post_id: "347829",
		   post_type: "link",
		   user_id: "111193",
		   text: "this is the beginning",
		   media_url: "http://homepages.cae.wisc.edu/~ece533/images/girl.png",
		   upvotes: "2172",
		   downvotes: "642"
	  }];
	 
	  o.forEach(function(item) {
	    $("#newsfeedCards")[0].appendChild(buildCard(item));
	  }.bind(this));*/

	/* <div class="card customCard">
				<div class="card-header" style="background-color: rgba(0,0,0,0);">
					<div class="d-flex justify-content-start">
						<img class="rounded-circle" src="http://homepages.cae.wisc.edu/~ece533/images/girl.png"  style="height: 3rem; width: 3rem;" data-holder-rendered="true">
						<div class="d-flex flex-column ml-2">
							<a href="#" class="card-text font-weight-normal">Soundarya Nurani Sundareswara</a>
							<p class="card-text font-italic" style="font-size: 0.8rem;">Graduate Student at Pennsylvania State university</p>
						</div>					
					</div>
				</div>
    			<div class="card-body">
					<h5 class="card-text font-weight-normal mb-3">Good morning!!</h5>
					<div class="d-flex flex-row">
						<a href="#" class="font-weight-normal">Like</a>
						<a href="#" class="font-weight-normal ml-3">Comment</a>
					</div>
    			</div>
				<div class="card-header">
					<div class="d-flex justify-content-start">
						<img class="rounded-circle" src="http://homepages.cae.wisc.edu/~ece533/images/girl.png"  style="height: 3rem; width: 3rem;" data-holder-rendered="true">
						<input class="form-control form-control-lg ml-2" type="text">
					</div>
				</div>
            </div>*/
/*	function buildCard(carditem) {
		var customCardDiv = document.createElement('div');
		customCardDiv.className = 'card customCard';
		var cardHeaderDiv = document.createElement('div');
		cardHeaderDiv.className = 'card-header';
		cardHeaderDiv.style = 'background-color: rgba(0,0,0,0);';
		var cardHeaderFlex = document.createElement('div');
		cardHeaderFlex.className = 'd-flex justify-content-start';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		img.src = carditem.src;
		img.style = 'height: 2rem; width: 2rem;';
		var cardHeaderNameFlex = document.createElement('div');
		cardHeaderNameFlex.className = 'd-flex align-items-center ml-2';
		var nameLink = document.createElement('a');
		nameLink.className = 'card-text font-weight-normal';
		nameLink.innerHTML = carditem.name;
		cardHeaderNameFlex.appendChild(nameLink);
		cardHeaderFlex.appendChild(img);
		cardHeaderFlex.appendChild(cardHeaderNameFlex);
		cardHeaderDiv.appendChild(cardHeaderFlex);

		var cardBodyDiv = document.createElement('div');
		cardBodyDiv.className = 'card-body';
		var postTextH = document.createElement('h5');
		postTextH.className = 'card-text font-weight-normal mb-3';
		postTextH.innerHTML = carditem.post;
			
		var postResultDiv = document.createElement('div');
		postResultDiv.className = 'd-flex flex-row';
		var likeResultText = document.createElement('div');
		likeResultText.className = 'font-weight-normal';
		likeResultText.innerHTML = carditem.name + ' people liked this'
		var commentResultLink = document.createElement('div');
		commentResultLink.className = 'font-weight-normal ml-3';
		commentResultLink.innerHTML = carditem.name + ' comments';
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
		cardFooterImg.src = carditem.src;
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
	}*/

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
		var selected_number = Math.round(Math.random()*9)+1;
		img.src = "https://randomuser.me/portraits/lego/"+selected_number+".jpg";
		img.style = 'height: 2rem; width: 2rem;';
		var cardHeaderNameFlex = document.createElement('div');
		cardHeaderNameFlex.className = 'd-flex align-items-center ml-2';
		var nameLink = document.createElement('a');
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
		if(carditem.upvotes >= 1000){
			likeResultText.innerHTML = carditem.upvotes/1000 + 'k people liked this';
		}
		else{
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

	$('#createModalId').on('show.bs.modal', function (e) {
		var button = $(e.relatedTarget);
		var dataObj = button.data('post');
		var modal = $(this);
		modal.find('.modal-title').text('Create post');
	});

	$('#createPostBtn').on('click', function (e) {
		var postData = $('#postTextareaId').val();
		var data = {
			text: $('#postTextareaId').val(),
			media_url: "",
			date: new Date().toJSON().slice(0, 10).split('-').join('-'),
			time: new Date().toJSON().slice(11, 19),
			upvotes: 0,
			downvotes: 0
		};
		
		$.ajax({
			type: "POST",
			data: data,
			url: getUrl.createpost,
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
			},
			error: function (xhr, resp, text) {

			}
		});
	});

	function getUrl() {
		var url = {
			postids: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/newsfeed",
			postcontent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/getpost",
			createpost: "http://40.121.195.146:8000/api-gateway.php/penn-connect/post",
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout"
		};
		return url;
	}
	/*$('#loading-image').bind('ajaxStart', function(){
	    $(this).show();
	}).bind('ajaxStop', function(){
	    $(this).hide();
	});   */
});
