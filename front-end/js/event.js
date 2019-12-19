$(function () {
	'use strict'
    var eventname = $('input[name="eventname"]');
    var description = $('input[name="description"]'); 
	var eventID = location.search.split('event_id=')[1];
	//tinymeercat385@psu.edu
	//passwd
	function toggleMembership(){
		$.ajax({
			type: "POST",
			data: JSON.stringify({group_id : groupID}),
			url: getUrl().togglemembership,
			success: function (e) {
				location.reload();
			},
			error: function(xhr, resp, text) {
				console.log(xhr);
			}
		});
	}
    $("#formcreateevent").on("submit", function (e) {
		e.preventDefault();
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
		data: JSON.stringify({event_id: [eventID]}),
		url: getUrl().getthisevent,
		success: function (e) {
			buildEventCard(e.body[0]);
		},
		error: function (xhr, resp, text) {}
	});
    
	$.ajax({
		type: "POST",
		url: getUrl().geteventparticipants,
		data: JSON.stringify({event_id: eventID }),
		success: function (e) {
			e.body.forEach(function(item){
				buildParticipantsCard(item);
			});
		},
		error: function (xhr, resp, text) {
			$("#eventCards")[0].innerHTML = "<p>There are no participants for this event</p>";
		}
	});
	
	function buildEventCard(eventDetails) {
		var customCardHeaderDiv = document.createElement('div');
		customCardHeaderDiv.className = 'card-header text-center';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		img.src = 'https://randomuser.me/portraits/lego/4.jpg';
		img.style = 'height: 5rem; width: 5rem;';
		var cardHeaderTitle = document.createElement('h5');
		cardHeaderTitle.className = 'card-title';
		cardHeaderTitle.innerHTML = eventDetails.event_name;
		var cardHeaderDesc = document.createElement('p');
		cardHeaderDesc.className = 'font-italic';
		cardHeaderDesc.style = 'font-size: 0.8rem;';
		cardHeaderDesc.innerHTML = "Status: " + eventDetails.status.charAt(0).toUpperCase() + eventDetails.status.slice(1);
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
		memberCountDiv.innerHTML = eventDetails.event_member_count;
		flexboxDiv.appendChild(memberDiv);
		flexboxDiv.appendChild(memberCountDiv);

		var flexboxDateTimeDiv = document.createElement('div');
		flexboxDateTimeDiv.className = 'd-flex justify-content-between bg-white';
		var eventDateTimeDiv = document.createElement('div');
		eventDateTimeDiv.className = 'card-text font-weight-normal';
		eventDateTimeDiv.innerHTML = 'Event date & time';
		var eventTimestampDiv = document.createElement('div');
		eventTimestampDiv.className = 'card-text font-weight-normal';
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "August",
                       "September", "October", "November", "December"];
        var currentDateTime = new Date(eventDetails.event_timestamp);
        var datetime = currentDateTime.getDate() + " " + months[currentDateTime.getMonth()] + " " + currentDateTime.getFullYear() +
                        ", " + currentDateTime.getHours() + ":" + currentDateTime.getMinutes();
		eventTimestampDiv.innerHTML = datetime;
		flexboxDateTimeDiv.appendChild(eventDateTimeDiv);
		flexboxDateTimeDiv.appendChild(eventTimestampDiv);
		var btn1Text, btn2Text;
		switch(eventDetails.status) {
			case 'going':
				btn1Text = 'Interested';
				btn2Text = 'Cancel';
				break;
			case 'interested':
				btn1Text = 'Going';
				btn2Text = 'Cancel';
				break;		
		}
		var button1 = document.createElement('button');
		button1.className = "btn btn-outline-info mt-2";
		button1.type = "button";
		button1.innerHTML = btn1Text;
		button1.addEventListener('click', function(e) {
			updateSubscriptionStatus(e.target.innerText);
		});
		var button2 = document.createElement('button');
		button2.className = "btn btn-outline-info ml-2 mt-2";
		button2.type = "button";
		button2.innerHTML = btn2Text;
		button2.addEventListener('click', function(e) {
			updateSubscriptionStatus(e.target.innerText);
		});
		customCardBodyDiv.appendChild(flexboxDiv);
		customCardBodyDiv.appendChild(flexboxDateTimeDiv);
		if (eventDetails.status == 'going' || eventDetails.status == 'interested') {
			customCardBodyDiv.appendChild(button1);
			customCardBodyDiv.appendChild(button2);
		}
		$("#eventCard")[0].appendChild(customCardHeaderDiv);
		$("#eventCard")[0].appendChild(customCardBodyDiv);	
       
	}

	function updateSubscriptionStatus(status) {
		var data = {
			"event_id": eventID,
			"subscription_status": status.charAt(0).toLowerCase() + status.slice(1)
		};
		$.ajax({
			type: "POST",
			url: getUrl().eventsubscription,
			data: JSON.stringify(data),
			success: function (e) {
				if (status == 'Cancel') {
					window.location = '/userevents.html';
				} else {
					window.location.reload();
				}
			},
			error: function (xhr, resp, text) {}
		});
	}

	function buildParticipantsCard(carditem) {
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
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?user_id="+carditem.member_user_id+"\">"+carditem.fname.charAt(0).toUpperCase() + carditem.fname.slice(1) + " " + carditem.lname.charAt(0).toUpperCase() + carditem.lname.slice(1)+"</a>";
		cardHeaderNameFlex.appendChild(nameLink);
		cardHeaderFlex.appendChild(img);
		cardHeaderFlex.appendChild(cardHeaderNameFlex);
		cardHeaderDiv.appendChild(cardHeaderFlex);

		var cardBodyDiv = document.createElement('div');
		cardBodyDiv.className = 'card-body';
		var status = document.createElement('p');
		status.innerHTML = "Subscription status: " + carditem.status.charAt(0).toUpperCase() + carditem.status.slice(1);
		
		var email = document.createElement('p');
		email.innerHTML = "Email: " + carditem.email;
	
		cardBodyDiv.appendChild(status);
		cardBodyDiv.appendChild(email);
		
		customCardDiv.appendChild(cardHeaderDiv);
		customCardDiv.appendChild(cardBodyDiv);

		$("#eventCards")[0].appendChild(customCardDiv);
	}

	$('#formSearch').on('submit', function(e) {
		e.preventDefault();
		var searchText = $('#searchInputId').val();
		//AJAX call for search
		window.location = '/search.html';
	});
	
	$('#createPostModal').on('show.bs.modal', function (e) {
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
				$('#createPostModal').modal('hide');
			},
			error: function (xhr, resp, text) {
			}
		});
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
			eventsubscription: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/manage_event_subscription", 
			createpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/post",
			createevent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/create_event",
            geteventparticipants: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/get_event_participants", 
			getthisevent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/get_this_event",
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout",
			creategroup: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/creategroup"
		};
		return url;
	}

});
