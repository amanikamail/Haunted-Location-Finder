
jQuery(document).ready(function ($) {

	$.ajaxSetup({
		error:function (jqXHR, exception) {
			if (jqXHR.status === 0) {
				alert('Not connect.\n Verify Network.');
			} else if (jqXHR.status == 404) {
				alert('Requested page not found. [404]');
			} else if (jqXHR.status == 500) {
				alert('Internal Server Error [500].');
			} else if (exception === 'parsererror') {
				alert('Requested JSON parse failed.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Ajax request aborted.');
			} else {
				alert('Uncaught Error.\n' + jqXHR.responseText);
			}
		}
	});

	var geocoder;
	var map;
	var address;

	function getLocationDetails() {
		$.ajax({
			url:"/client/getLocationList/",
			type:"POST",
			success:function (feedback) {
				var pathname = window.location.pathname.split("/");
				var user = {};
				data = $.parseJSON(feedback);
				var items = [];
				if (feedback.length > 0 ) {
					$('select#address').empty();
					$('select#address').append('<option value="">None</option>');
					$.each(data, function () {
						var newRow = $('<option value="' + this.idlocation + '">' + this.location_name + '</option>');
						$('select#address').append(newRow);

					});
				}
				$('select#address').append(items.join(''));
			},
			failure:function (data) {
				console.log('getLocationDetails Failed');
			}
		});
	}

	function initialize() {
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(-34.397, 150.644);
		var mapOptions = {
			zoom: 8,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	}

	function codeAddress(address) {

		geocoder = new google.maps.Geocoder();

		geocoder.geocode( { 'address': address}, function(results, status) {

			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	function codeLatLng() {
		var input = document.getElementById("latlng").value;
		var latlngStr = input.split(",",2);
		var lat = parseFloat(latlngStr[0]);
		var lng = parseFloat(latlngStr[1]);
		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					map.setZoom(11);
					marker = new google.maps.Marker({
						position: latlng,
						map: map
					});
					infowindow.setContent(results[1].formatted_address);
					infowindow.open(map, marker);
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
	}

	function getAddress() {

	}

	function updateLocation(feedback) {

		$('#locationinfo h1').empty();
		$('#locationinfo h3').empty();
		$('#locationinfo p').empty();

		data = $.parseJSON(feedback);
		$.each(data, function () {
			$('#locationinfo h1').append(this.location_name);
			$('#locationinfo h3').append(this.location_street + ' ' + this.location_city + ' ' + this.location_state + ' ' + this.location_zip);
			$('#locationinfo p').append(this.description);
		});
	}

	if ($('body').hasClass('locations')) {

		map = new google.maps.Map(document.getElementById("map_canvas"));

		getLocationDetails();

		$('#map_canvas').gmap({'callback': function() {
			var self = this;
			self.getCurrentPosition(function(position, status) {
				if ( status === 'OK' ) {
					var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					console.log('clientpostion' + clientPosition);

					self.addMarker({'position': clientPosition, 'bounds': true});
					self.addShape('Circle', {
						'strokeWeight': 0,
						'fillColor': "#008595",
						'fillOpacity': 0.25,
						'center': clientPosition,
						'radius': 15,
						'clickable': false
					});
				}
			});
		}});

		$('form#update').submit( function(e){
			e.preventDefault();

			var idlocation = $('input[name="address"]').val();
			var data = 'csrf_test_name=' + $.cookie('csrf_cookie_name') + '&';
			data += $('form#update').serialize();
			$.ajax({
				url:"/client/getLocation",
				type:"POST",

				data: data,
				success:function (feedback) {
					updateLocation(feedback);
					data = $.parseJSON(feedback);

					$.each(data, function () {
						address = this.location_street + ', ' + this.location_city + ', ' + this.location_state + ' ' + this.location_zip;
					});
					console.log(address);
					initialize();
					codeAddress(address);
				},
				failure: function (data) {
					console.log(data);
				}
			});

		});

	} else {
		console.log('failure');
	}

});

	
