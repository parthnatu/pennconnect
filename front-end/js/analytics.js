$(function () {

    var map;
    function initMap() {

        var centerLocation = new google.maps.LatLng(50.0875726, 14.4189987);
         
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: centerLocation,
            zoom: 2.5,
            panControl: false,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        map = new google.maps.Map(mapCanvas, mapOptions);
    }


    google.maps.event.addDomListener(window, 'load', initMap);


    function addMarkerToMap(item) {
        var location = new google.maps.LatLng(item.latlng[0], item.latlng[1]);
        var markerImage = '/marker.png';

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: markerImage
        });
		
        var contentString = '<div class="info-window">' +
                '<h3>'+ item.natname+'</h3>' +
                '<div class="info-content">' +
                '<p>Number of users: ' + item.count + '</p>' +
                '</div>' +
                '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 400
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });

        var styles = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];

        map.set('styles', styles);
    }

    $.ajax({
        type: "POST",
        url: getUrl().analytics,
        success: function (e) {
           var item, users = [], postCount = [], num_sessions, num_users, num_countries, userWithMaxPost;
           e.body.nat_num.forEach(function(item) {
                addMarkerToMap(item);
           });
           e.body.user_post_count.forEach(function(item) {
                users.push(item.name);
                postCount.push(item.cnt);
           });
           num_sessions = e.body.num_sessions.count;
           $('#numSessionId')[0].innerHTML = "Number of sessions: " + num_sessions;
           num_users = e.body.num_users.count;
           $('#numUsersId')[0].innerHTML = "Number of users: " + num_users;
           drawUserPostChart(users, postCount);
        },
        error: function (xhr, resp, text) {

        }
    });

    function drawUserPostChart(users, postCount) {
        var color = Chart.helpers.color;
        var barChartData = {
            labels: users,
            datasets: [{
                label: 'Number of posts',
                    backgroundColor: color('rgb(255, 99, 132)').alpha(0.5).rgbString(),
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    data: postCount
            }]
        };
        var ctx = document.getElementById('canvas').getContext('2d');
		window.myBar = new Chart(ctx, {
			type: 'bar',
			data: barChartData,
			options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'Top users with maximum number of posts'
                },
                scales: {
                    yAxes: [{
                      ticks: {
                        suggestedMin: 0
                      }
                    }]
                }
            }
		});
    }
    
    function getUrl() {
		var url = {
			analytics: "http://pennconnect.duckdns.org:8000/api-gateway.php/penn-connect/analytics"
		};
		return url;
	}
	
});