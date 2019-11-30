$(function () {
	'use strict'
	var searchResults = [{
		type: "profile",
		fname: "soundarya",
		lname: "sundar",
		email: "nslallu@gmail.com",
		friend_count: "1120",
		graduation_year: "2021",
		user_id: "121"
	}, {
		type: "group",
		group_name: "Soundarya's Friends",
		members: "23",
		owner: "Soundarya",
		group_id: "1"
	}, {
		type: "event",
		event_name: "Soundarya's events",
		going: "20",
		interested: "40",
		owner: "Micheal",
		event_id: "2"
	}, {
		type: "profile",
		fname: "sound",
		lname: "war",
		email: "dskb@gmail.com",
		friend_count: "10",
		graduation_year: "2018",
		user_id: "23"
	}, {
		type: "group",
		group_name: "Sound's Friends",
		members: "23",
		owner: "Sound",
		group_id: "21"
	}, {
		type: "event",
		event_name: "Sound's events",
		going: "64",
		interested: "34",
		owner: "Hershey",
		event_id: "90"
	}];
	
	//AJAX calls to get the search results
	
	searchResults.forEach(function(item) {
		switch(item.type) {
			case "profile":
				var profile = buildProfileItem(item);
				$("#profileCardCustomBody")[0].appendChild(profile);
			break;
			case "group":
				var group = buildGroupItem(item);
				$("#groupsCardCustomBody")[0].appendChild(group);			
			break;
			case "event":
				var event = buildEventItem(item);
				$("#eventsCardCustomBody")[0].appendChild(event);
			break;
		}
	});
		
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
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?user_id="+item.event_id+"\">"+item.group_name+"</a>";
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
		membersCountDiv.innerHTML = item.members;
		flexboxMembersDiv.appendChild(membersDiv);
		flexboxMembersDiv.appendChild(membersCountDiv);
		
		var flexboxOwnerDiv = document.createElement('div');
		flexboxOwnerDiv.className = 'd-flex justify-content-between bg-white';
		var ownerDiv = document.createElement('div');
		ownerDiv.className = 'card-text font-weight-normal';
		ownerDiv.innerHTML = 'Owner';
		var ownerNameDiv = document.createElement('div');
		ownerNameDiv.className = 'card-text font-weight-normal';
		ownerNameDiv.innerHTML = item.owner;
		flexboxOwnerDiv.appendChild(ownerDiv);
		flexboxOwnerDiv.appendChild(ownerNameDiv);		
		
		customCardBodyDivGroup.appendChild(cardHeaderFlexGroup);
		customCardBodyDivGroup.appendChild(flexboxMembersDiv);
		customCardBodyDivGroup.appendChild(flexboxOwnerDiv);
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
		nameLink.innerHTML = "<a href=\"http://pennconnect.duckdns.org:8000/user_profile.html?user_id="+item.group_id+"\">"+item.event_name+"</a>";
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
		
		var flexboxOwnerDiv = document.createElement('div');
		flexboxOwnerDiv.className = 'd-flex justify-content-between bg-white';
		var ownerDiv = document.createElement('div');
		ownerDiv.className = 'card-text font-weight-normal';
		ownerDiv.innerHTML = 'Owner';
		var ownerNameDiv = document.createElement('div');
		ownerNameDiv.className = 'card-text font-weight-normal';
		ownerNameDiv.innerHTML = item.owner;
		flexboxOwnerDiv.appendChild(ownerDiv);
		flexboxOwnerDiv.appendChild(ownerNameDiv);		
		
		customCardBodyDivEvent.appendChild(cardHeaderFlexEvent);
		customCardBodyDivEvent.appendChild(flexboxMembersDiv);
		customCardBodyDivEvent.appendChild(flexboxOwnerDiv);
		customCardDivEvent.appendChild(customCardBodyDivEvent);	
		return customCardDivEvent;
	}
});