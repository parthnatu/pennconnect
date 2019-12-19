$(function () {
	'use strict'
	var searchEventsNum = 0;
	var searchGroupsNum = 0;
	var searchProfilesNum = 0;
	$.ajax({
		type: "POST",
		data: JSON.stringify({
			"search_string": window.location.search.split("=")[1]
		}),
		url: getUrl().search,
		success: function (e) {
			if (e.body.length > 1) {
				e.body.forEach(function(results) {
					populateSearch(results);
				});
			} else {
				populateSearch(e.body[0]);
			}
			if (searchProfilesNum == 0) {	
				var noProfileResultText = document.createElement('p');
				noProfileResultText.className = 'font-italic';
				noProfileResultText.style = 'font-size: 0.8rem; margin-bottom: 0rem;';	
				noProfileResultText.innerHTML = "No matching profiles found";
				$("#profileCardCustomBody")[0].appendChild(noProfileResultText);
			}
			if (searchGroupsNum == 0) {
				var noGroupResultText = document.createElement('p');
				noGroupResultText.className = 'font-italic';
				noGroupResultText.style = 'font-size: 0.8rem; margin-bottom: 0rem;';
				noGroupResultText.innerHTML = "No matching groups found";
				$("#groupsCardCustomBody")[0].appendChild(noGroupResultText);
			}
			if (searchEventsNum == 0) {
				var noEventResultText = document.createElement('p');
				noEventResultText.className = 'font-italic';
				noEventResultText.style = 'font-size: 0.8rem; margin-bottom: 0rem;';
				noEventResultText.innerHTML = "No matching events found";
				$("#eventsCardCustomBody")[0].appendChild(noEventResultText);
			}
		},
		error: function (xhr, resp, text) {
			var noProfileResultText = document.createElement('p');
			noProfileResultText.className = 'font-italic';
			noProfileResultText.style = 'font-size: 0.8rem; margin-bottom: 0rem;';	
			noProfileResultText.innerHTML = "No matching profiles found";
			$("#profileCardCustomBody")[0].appendChild(noProfileResultText);
			var noGroupResultText = document.createElement('p');
			noGroupResultText.className = 'font-italic';
			noGroupResultText.style = 'font-size: 0.8rem; margin-bottom: 0rem;';
			noGroupResultText.innerHTML = "No matching groups found";
			$("#groupsCardCustomBody")[0].appendChild(noGroupResultText);
			var noEventResultText = document.createElement('p');
			noEventResultText.className = 'font-italic';
			noEventResultText.style = 'font-size: 0.8rem; margin-bottom: 0rem;';
			noEventResultText.innerHTML = "No matching events found";
			$("#eventsCardCustomBody")[0].appendChild(noEventResultText);
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
	function populateSearch(searchResults) {
		searchResults.forEach(function(item) {
			switch(item.object_type) {
				case "user":
					var profile = buildProfileItem(item);
					searchProfilesNum++;
					$("#profileCardCustomBody")[0].appendChild(profile);
				break;
				case "group":
					var group = buildGroupItem(item);
					searchGroupsNum++;
					$("#groupsCardCustomBody")[0].appendChild(group);			
				break;
				case "event":
					var event = buildEventItem(item);
					searchEventsNum++;
					$("#eventsCardCustomBody")[0].appendChild(event);
				break;
			}
		});
	}
		
	function buildProfileItem(item) {
		var customCardDivProfile = document.createElement('div');
		customCardDivProfile.className = 'card customCard';
		
		var customCardBodyDivProfile = document.createElement('div');
		customCardBodyDivProfile.className = 'card-body';
		
		var cardHeaderFlexProfile = document.createElement('div');
		cardHeaderFlexProfile.className = 'd-flex justify-content-start';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		var selected_number = Math.round(Math.random() * 9) + 1;
		img.src = "https://randomuser.me/portraits/lego/" + selected_number + ".jpg";
		img.style = 'height: 2rem; width: 2rem;';
		var cardHeaderNameFlexProfile = document.createElement('div');
		cardHeaderNameFlexProfile.className = 'd-flex align-items-center ml-2';
		var nameLink = document.createElement('a');
		nameLink.id = "friendNameLinkId";
		nameLink.className = 'card-text font-weight-normal';
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?user_id="+item.user_id+"\">"+item.fname.charAt(0).toUpperCase() + item.fname.slice(1) + " " + item.lname.charAt(0).toUpperCase() + item.lname.slice(1)+"</a>";
		cardHeaderNameFlexProfile.appendChild(nameLink);
		cardHeaderFlexProfile.appendChild(img);
		cardHeaderFlexProfile.appendChild(cardHeaderNameFlexProfile);
		
		
		var flexboxConnectionsDiv = document.createElement('div');
		flexboxConnectionsDiv.className = 'd-flex justify-content-between bg-white';
		var connectionsDiv = document.createElement('div');
		connectionsDiv.className = 'card-text font-weight-normal';
		connectionsDiv.innerHTML = 'Connections';
		var connectionsCountDiv = document.createElement('div');
		connectionsCountDiv.className = 'card-text font-weight-normal';
		connectionsCountDiv.innerHTML = item.friend_count;
		flexboxConnectionsDiv.appendChild(connectionsDiv);
		flexboxConnectionsDiv.appendChild(connectionsCountDiv);
		
		var flexboxEmailDiv = document.createElement('div');
		flexboxEmailDiv.className = 'd-flex justify-content-between bg-white';
		var emailDiv = document.createElement('div');
		emailDiv.className = 'card-text font-weight-normal';
		emailDiv.innerHTML = 'Email';
		var emailIdDiv = document.createElement('div');
		emailIdDiv.className = 'card-text font-weight-normal';
		emailIdDiv.innerHTML = item.email;
		flexboxEmailDiv.appendChild(emailDiv);
		flexboxEmailDiv.appendChild(emailIdDiv);		
		
		var gradYearDiv = document.createElement('div');
		gradYearDiv.className = 'd-flex justify-content-between bg-white';
		var gradDiv = document.createElement('div');
		gradDiv.className = 'card-text font-weight-normal';
		gradDiv.innerHTML = 'Graduation year';
		var yearDiv = document.createElement('div');
		yearDiv.className = 'card-text font-weight-normal';
		yearDiv.innerHTML = item.graduation_year;
		gradYearDiv.appendChild(gradDiv);
		gradYearDiv.appendChild(yearDiv);	
		
		
		customCardBodyDivProfile.appendChild(cardHeaderFlexProfile);
		customCardBodyDivProfile.appendChild(flexboxConnectionsDiv);
		customCardBodyDivProfile.appendChild(flexboxEmailDiv);
		customCardBodyDivProfile.appendChild(gradYearDiv);
		customCardDivProfile.appendChild(customCardBodyDivProfile);
		
		return customCardDivProfile;
	}
	
	function buildGroupItem(item) {
		var customCardDivGroup = document.createElement('div');
		customCardDivGroup.className = 'card customCard';
		
		var customCardBodyDivGroup = document.createElement('div');
		customCardBodyDivGroup.className = 'card-body';
		
		var cardHeaderFlexGroup = document.createElement('div');
		cardHeaderFlexGroup.className = 'd-flex justify-content-start';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		var selected_number = Math.round(Math.random() * 9) + 1;
		img.src = "https://randomuser.me/portraits/lego/" + selected_number + ".jpg";
		img.style = 'height: 2rem; width: 2rem;';
		var cardHeaderNameFlexGroup = document.createElement('div');
		cardHeaderNameFlexGroup.className = 'd-flex align-items-center ml-2';
		var nameLink = document.createElement('a');
		nameLink.id = "friendNameLinkId";
		nameLink.className = 'card-text font-weight-normal';
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?group_id="+item.group_id+"\">"+item.group_name+"</a>";
		cardHeaderNameFlexGroup.appendChild(nameLink);
		cardHeaderFlexGroup.appendChild(img);
		cardHeaderFlexGroup.appendChild(cardHeaderNameFlexGroup);
		
		var flexboxMembersDiv = document.createElement('div');
		flexboxMembersDiv.className = 'd-flex justify-content-between bg-white';
		var membersDiv = document.createElement('div');
		membersDiv.className = 'card-text font-weight-normal';
		membersDiv.innerHTML = 'Members';
		var membersCountDiv = document.createElement('div');
		membersCountDiv.className = 'card-text font-weight-normal';
		membersCountDiv.innerHTML = item.event_member_count;
		flexboxMembersDiv.appendChild(membersDiv);
		flexboxMembersDiv.appendChild(membersCountDiv);	
		
		customCardBodyDivGroup.appendChild(cardHeaderFlexGroup);
		customCardBodyDivGroup.appendChild(flexboxMembersDiv);
		customCardDivGroup.appendChild(customCardBodyDivGroup);	
		return customCardDivGroup;
	}
	
	function buildEventItem(item) {
		var customCardDivEvent = document.createElement('div');
		customCardDivEvent.className = 'card customCard';
		
		var customCardBodyDivEvent = document.createElement('div');
		customCardBodyDivEvent.className = 'card-body';
		
		var cardHeaderFlexEvent = document.createElement('div');
		cardHeaderFlexEvent.className = 'd-flex justify-content-start';
		var img = document.createElement('img');
		img.className = 'rounded-circle';
		var selected_number = Math.round(Math.random() * 9) + 1;
		img.src = "https://randomuser.me/portraits/lego/" + selected_number + ".jpg";
		img.style = 'height: 2rem; width: 2rem;';
		var cardHeaderNameFlexEvent = document.createElement('div');
		cardHeaderNameFlexEvent.className = 'd-flex align-items-center ml-2';
		var nameLink = document.createElement('a');
		nameLink.id = "friendNameconnectionsDivLinkId";
		nameLink.className = 'card-text font-weight-normal';
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?event_id="+item.event_id+"\">"+item.event_name+"</a>";
		cardHeaderNameFlexEvent.appendChild(nameLink);
		cardHeaderFlexEvent.appendChild(img);
		cardHeaderFlexEvent.appendChild(cardHeaderNameFlexEvent);		
		
		var flexboxMembersDiv = document.createElement('div');
		flexboxMembersDiv.className = 'd-flex justify-content-between bg-white';
		var  membersDiv = document.createElement('div');
		membersDiv.className = 'card-text font-weight-normal';
		membersDiv.innerHTML = 'Going';
		var membersCountDiv = document.createElement('div');
		membersCountDiv.className = 'card-text font-weight-normal';
		membersCountDiv.innerHTML = item.going;
		flexboxMembersDiv.appendChild(membersDiv);
		flexboxMembersDiv.appendChild(membersCountDiv);	
		
		customCardBodyDivEvent.appendChild(cardHeaderFlexEvent);
		customCardBodyDivEvent.appendChild(flexboxMembersDiv);
		customCardDivEvent.appendChild(customCardBodyDivEvent);	
		return customCardDivEvent;
	}

	$('#formSearch').on('submit', function(e) {
		e.preventDefault();
		var searchText = $('#searchInputId').val();
		$('#searchInputId').value = "";
		window.location = '/search.html?searchText=' + searchText;
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
			search: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/search/",
			logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout"
		};
		return url;
	}
});