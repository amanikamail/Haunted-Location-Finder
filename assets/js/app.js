jQuery(document).ready(function ($) {

	$.ajaxSetup({
		error: function (jqXHR, exception) {
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

	var geocoder, map, address, origin, lat, lng;

	function getLocationDetails() {
		$.ajax({
			url: "/locations/getLocationList/",
			type: "POST",
			success: function (feedback) {
				var pathname = window.location.pathname.split("/");
				var user = {};
				data = $.parseJSON(feedback);
				var items = [];
				if (feedback.length > 0) {
					$('select#address').empty();
					$('select#address').append('<option value="">None</option>');
					$.each(data, function () {
						var newRow = $('<option value="' + this.idlocation + '">' + this.location_name + '</option>');
						$('select#address').append(newRow);

					});
				}
				$('select#address').append(items.join(''));
			},
			failure: function (data) {
				console.log('getLocationDetails Failed');
			}
		});
	}

	function updateMap(address) {
		$('#map-canvas').gmap3({ action: 'geoLatLng',
			callback: function (latLng) {
				if (latLng) {
					$(this).data('origin', latLng);
					$(this).gmap3(
						{
							action: 'clear'
						},
						{
							action: 'setCenter',
							args: [ latLng ]
						},
						{
							action: 'addMarker',
							latLng: latLng,
							map: {
								center: true,
								zoom: 10
							}
						},
						{
							action: 'addMarker',
							address: address,
							map: {
								center: true,
								zoom: 10
							}
						}
					);
				} else {
					alert('not localised !');
				}
			}
		});
	}

	function getDirections(origin, address) {
		$('#map-canvas').gmap3(
			{action: 'clear'},
			{ action: 'getRoute',
				options: {
					origin: origin,
					destination: address,
					travelMode: google.maps.DirectionsTravelMode.DRIVING
				},
				callback: function (results) {
					if (!results) return;
					$(this).gmap3(
						{ action: 'init',
							zoom: 13,
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							streetViewControl: true,
							center: origin
						},
						{ action: 'addDirectionsRenderer',
							options: {
								preserveViewport: true,
								draggable: false,
								directions: results
							}
						},
						{
							action: 'setDirectionsPanel',
							id: 'map-directions'
						}
					);
				}
			}
		);
	}

	function getDistance(origin, address) {

		$('#map-canvas').gmap3({
			action: 'geoLatLng',
			callback: function (latLng) {
				$(this).data('origin', latLng);
			},
			action: 'getDistance',
			options: {
				origins: [origin],
				destinations: [address],
				travelMode: google.maps.TravelMode.DRIVING
			},
			callback: function (results) {
				var html = '';
				if (results) {
					for ( var i = 0; i < results.rows.length; i++ ) {
						var elements = results.rows[i].elements;
						for ( var j = 0; j < elements.length; j++ ) {
							switch ( elements[j].status ) {
								case google.maps.DistanceMatrixStatus.OK:
									console.log('distance: ' + elements[j].distance.text + ' duration: ' + elements[j].duration.text);
									html += elements[j].distance.text + ' (' + elements[j].duration.text + ')<br />';
									break;
								case google.maps.DistanceMatrixStatus.NOT_FOUND:
									html += 'The origin and/or destination of this pairing could not be geocoded<br />';
									break;
								case google.maps.DistanceMatrixStatus.ZERO_RESULTS:
									html += 'No route could be found between the origin and destination.<br />';
									break;
							}
						}
					}
				} else {
					html = 'error';
				}
				$('#results').html(html);
			}
		});
	}

	function updateLocation(feedback) {

		$('#locationinfo h2').empty();
		$('#locationinfo h4').empty();
		$('#locationinfo p').empty();
		$('#locationinfo #tags ul').empty();

		data = $.parseJSON(feedback);
		$.each(data, function () {
			$('#locationinfo h2').append(this.location_name);
			$('#locationinfo h4').append(this.location_street + ' ' + this.location_city + ' ' + this.location_state + ' ' + this.location_zip);
			$('#locationinfo p').append(this.description);

			var mystring = this.tags;

			mystring = '<li><a class="tag">' + mystring.replace(/,/gi, '</a></li><li><a class="tag">') + '</li>';
			$('#locationinfo #tags ul').append(mystring);
		});


	}

	function geoCode(location) {
		$('#map-canvas').gmap3(
			{ action: 'getLatLng',
				address: location,
				callback: function (result) {
					if (result) {
						ParseLocation(result[0].geometry.location);

//						$(this).gmap3({action: 'setCenter', args:[ result[0].geometry.location ]});
					} else {
						alert('Bad address!');
					}
				}
			}
		);
	}

	function ParseLocation(location, lat, lng) {
		var lat = location.lat().toString().substr(0, 12);
		var lng = location.lng().toString().substr(0, 12);

		$('#tbxlat').val(lat);
		$('#tbxlng').val(lng);

	}

	function resetLocationForm(data) {
		$('input[name="userid"]').val(data.userid);
		$('input[name="location_name"]').val('');
		$('input[name="locationid"]').val('');
		$('input[name="tbxlat"]').val('');
		$('input[name="tbxlng"]').val('');
		$('input[name="location_street"]').val('');
		$('input[name="location_city"]').val('');
		$('input[name="location_state"]').val('');
		$('input[name="location_zip"]').val('');
		$('input[name="tags_tagsinput"]').val('');

		$('textarea[name="location_description"]').val('');
		CKEDITOR.instances['locationeditor'].setData('');

	}

	if ($('body').hasClass('addlocation')) {

		$('#tags').tagsInput({
			'height': '100px',
			'width': '300px',
			'interactive': true,
			'defaultText': 'add a tag',
			'placeholderColor': '#666666',
			'removeWithBackspace': true
		});

		/* Create a New Location or update an existing one */
		$('form#locationForm').submit(function (e) {

			e.preventDefault();

			$('#thankyou').css('display', 'none');

			var location = '';

			var location = $('input[name="location_street"]').val() + ', '
				+ $('input[name="location_city"]').val() + ', '
				+ $('input[name="location_state"]').val() + ', '
				+ $('input[name="location_zip"]').val();

			geoCode(location);

			var idlocation = $('input[name="idlocation"]').val();
			for ( instance in CKEDITOR.instances )
				CKEDITOR.instances[instance].updateElement();

			$.ajax({
				beforeSend: geoCode(location),
				success: function () {
					$.ajax({
						beforeSend: geoCode(location),
						url: "/client/locationUpdate",
						type: "POST",
						dataType: 'json',
						data: $('form#locationForm').serialize(),
						success: function (feedback) {
							console.log('Location Updated');
							var pathname = window.location.pathname.split("/");
							var data = {};
							data.idlocation = 0;
							data.userid = pathname[pathname.length - 2];
							data.location_name = 'Add A Location Name';
							data.location_street = "Street Address Goes Here";
							data.location_city = "City Goes Here";
							data.location_state = "State Goes Here";
							data.location_zip = "Zip Goes Here";
							data.location_description = "Insert Location Description Here";

							$('#thankyou').css('display', 'inline');
							resetLocationForm(data);
						}
					});
				}
			})


			return false;
		});
	}

	if ($('body').hasClass('locations')) {
		getLocationDetails();

		$('#map-canvas').gmap3({ action: 'geoLatLng',
			callback: function (latLng) {
				if (latLng) {
					$(this).gmap3({action: 'setCenter', args: [ latLng ]},
						{action: 'clear'},
						{ action: 'addMarker',
							latLng: latLng,
							map: {
								center: true,
								zoom: 10
							}}, origin = latLng);
				} else {
					alert('not localised !');
				}
			}
		});

		$('form#update').submit(function (e) {
			e.preventDefault();
			var data = 'csrf_test_name=' + $.cookie('csrf_cookie_name') + '&';
			data += $('form#update').serialize();
			$.ajax({
				url: "/locations/getLocation",
				type: "POST",
				data: data,
				success: function (feedback) {
					$('#map-directions').html('');
					updateLocation(feedback);
					data = $.parseJSON(feedback);

					$.each(data, function () {
						address = this.location_street + ', ' + this.location_city + ', ' + this.location_state + ' ' + this.location_zip;
					});

					getDirections(origin, address);
				},
				failure: function (data) {
					console.log(data);
				}
			});

		});

		$('#locations').on('click', 'a.loc', function (e) {

			e.preventDefault();

			data = 'csrf_test_name=' + $.cookie('csrf_cookie_name') + '&';
			data += 'address=' + $(this).attr('href');

			console.log(data);

			$.ajax({
				url: "/locations/getLocation",
				type: "POST",
				data: data,
				success: function (feedback) {
					$('#map-directions').html('');
					updateLocation(feedback);
					data = $.parseJSON(feedback);
					$.each(data, function () {
						address = this.location_street + ', ' + this.location_city + ', ' + this.location_state + ' ' + this.location_zip;
					});

					getDirections(origin, address);
				},
				failure: function (data) {
					console.log(data);
				}
			});

		});


		$('#tags').on('click', 'a.tag',  function (e) {

			e.preventDefault();

			var lat = origin.lat().toString().substr(0, 12);
			var lng = origin.lng().toString().substr(0, 12);

			data = 'csrf_test_name=' + $.cookie('csrf_cookie_name') + '&';
			data += 'latlng=' + origin + '&lat=' + lat + '&lng=' + lng + '&tag=' + $(this).text();

			$.ajax({
				url: "/locations/getTaggedLocations",
				type: "POST",
				dataType: "json",
				data: data,
				success: function (feedback) {

					if (feedback.data.length > 0) {
						$('#locations').empty();
						$('#locations').html('<h4>Locations within 50 Miles</h4>');
						$.each(feedback.data, function (i, obj) {
							var newRow = $('<div class="twelve columns"><p><a class="loc" href="' + obj.idlocation +'">' + obj.location_name + ' ' + obj.location_street + ',' + obj.location_city + ', ' + obj.location_state + ' '+ obj.location_zip + '</a></p></div>');
							$('#locations').append(newRow);
						});
					}
				},
				failure: function (feedback) {
					console.log('faq not updated: ' + feedback);
				}
			});


		})

	}

	if ($('body').hasClass('index')) {
		$('#slides').cycle({
			resizeContainer: false,
			slideResize: false
		});
	}

});

	
