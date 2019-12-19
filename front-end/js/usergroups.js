$(function() {
    'use strict'
    var userProfileId = location.search.split('user_id=')[1];
    var arrPostIds;
    var data = {
        user_id: userProfileId
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        url: getUrl().listgroups,
        success: function(e) {
            console.log(e);
            var item;
            e.body.forEach(function(item) {

                $("#groupCards")[0].appendChild(buildCard(item));

            });
        },
        error: function(xhr, resp, text){
		console.log(xhr);
		$("#groupCards")[0].innerHTML = "<p>This user is not a part of any groups</p>";
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
        nameLink.id = "group_id";
        nameLink.className = 'card-text font-weight-normal';
        nameLink.href = "http://pennconnect.duckdns.org:8000/group.html?group_id=" + carditem.group_id;
        nameLink.innerHTML = "<h5>" + carditem.group_name.charAt(0).toUpperCase() + carditem.group_name.slice(1) + "</h5>";
        cardHeaderNameFlex.appendChild(nameLink);
        cardHeaderFlex.appendChild(cardHeaderNameFlex);
        cardHeaderDiv.appendChild(cardHeaderFlex);

        var cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';
        var postadmin = document.createElement('p');
        postadmin.className = 'card-text font-weight-normal mb-3';
        postadmin.innerHTML = "Created By : " + carditem.admin_name;
        var postcreator = document.createElement('p');
        postcreator.className = 'card-text font-weight-normal mb-3';
        postcreator.innerHTML = "Created on : " + carditem.created_on;


        cardBodyDiv.appendChild(postadmin);
        cardBodyDiv.appendChild(postcreator);
        //cardBodyDiv.appendChild(postResultDiv);
        //cardBodyDiv.appendChild(postActionDiv);

        customCardDiv.appendChild(cardHeaderDiv);
        customCardDiv.appendChild(cardBodyDiv);
        //customCardDiv.appendChild(cardFooterDiv);

        return customCardDiv;
    }

    $('#formSearch').on('submit', function(e) {
		e.preventDefault();
		var searchText = $('#searchInputId').val();
		$('#searchInputId').value = "";
		window.location = '/search.html?searchText=' + searchText;
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
            postids: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/newsfeed",
            postcontent: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/getpost",
            createpost: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/post",
            userdetails: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/userdetails",
            logout: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/logout",
            userposts: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/userposts",
            togglefriend: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/toggle_friend",
            usergroups: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/get_group_posts",
            listgroups: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/listgroups"
        };
        return url;
    }
});
