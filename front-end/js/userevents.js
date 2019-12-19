$(function() {
    'use strict'
    var arrPostIds;
    $.ajax({
        type: "POST",
        url: getUrl().geteventlistforuser,
        success: function(e) {
            var item;
            e.body.forEach(function(item) {
                $("#eventCards")[0].appendChild(buildCard(item));
            });
        },
        error: function(xhr, resp, text){
		    $("#eventCards")[0].innerHTML = "<p>This user is not a part of any groups</p>";
        }
    });

    $('#createEventBtnId').on('click',function(e){
		var eventName = $('#eventNameId').val();
		$.ajax({
			type: "POST",
			data: JSON.stringify({event_name : eventName}),
			url: getUrl().createevent,
			success: function (e) {
				$('#createEventModal').modal('hide');
			},
			error: function (xhr, resp, text) {
			}
		});
	});

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
        nameLink.id = "event_id";
        nameLink.className = 'card-text font-weight-normal';
        nameLink.href = "http://pennconnect.duckdns.org:8000/event.html?event_id=" + carditem.event_id;
        nameLink.innerHTML = "<h5>" + carditem.event_name.charAt(0).toUpperCase() + carditem.event_name.slice(1) + "</h5>";
        cardHeaderNameFlex.appendChild(nameLink);
        cardHeaderFlex.appendChild(cardHeaderNameFlex);
        cardHeaderDiv.appendChild(cardHeaderFlex);

        var cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';
        var status = document.createElement('p');
        status.className = 'card-text font-weight-normal mb-3';
        status.innerHTML = "Status: " + carditem.status.charAt(0).toUpperCase() + carditem.status.slice(1);
        var participationtype = document.createElement('p');
        participationtype.className = 'card-text font-weight-normal mb-3';
        participationtype.innerHTML = "Participation: " + (carditem.participation_type == "creator" ? "Owner": "Participant");
        var membercount = document.createElement('p');
        membercount.className = 'card-text font-weight-normal mb-3';
        membercount.innerHTML = "Members: " + carditem.event_member_count;
        var eventDate = document.createElement('p');
        eventDate.className = 'card-text font-weight-normal mb-3';
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "August",
                       "September", "October", "November", "December"];
        var currentDateTime = new Date(carditem.event_timestamp);
        var datetime = currentDateTime.getDate() + " " + months[currentDateTime.getMonth()] + " " + currentDateTime.getFullYear() +
                        ", " + currentDateTime.getHours() + ":" + currentDateTime.getMinutes();
        eventDate.innerHTML = "Event date and time: " + datetime;       
        cardBodyDiv.appendChild(status);
        cardBodyDiv.appendChild(participationtype);
        cardBodyDiv.appendChild(membercount);
        cardBodyDiv.appendChild(eventDate);
        //cardBodyDiv.appendChild(postResultDiv);
        //cardBodyDiv.appendChild(postActionDiv);

        customCardDiv.appendChild(cardHeaderDiv);
        customCardDiv.appendChild(cardBodyDiv);
        //customCardDiv.appendChild(cardFooterDiv);

        return customCardDiv;
    }

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
    
	$('#formSearch').on('submit', function(e) {
		e.preventDefault();
		var searchText = $('#searchInputId').val();
		$('#searchInputId').value = "";
		window.location = '/search.html?searchText=' + searchText;
	});
	
	$('#createPostModal').on('show.bs.modal', function (e) {
		var button = $(e.relatedTarget);
		var dataObj = button.data('post');
		var modal = $(this);
		modal.find('.modal-title').text('Create post');
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

    $("#logoutId").on('click', function(e) {
        var url = getUrl().logout;
        $.ajax({
            type: "POST",
            url: url,
            success: function(e) {},
            error: function(xhr, resp, text) {

            }
        });
    });

    function getUrl() {
        var url = {
            createpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/post",
            createevent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/create_event",
            logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout",
            geteventlistforuser: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/get_event_list_for_user",
            deleteevent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/delete_event"
        };
        return url;
    }
});
