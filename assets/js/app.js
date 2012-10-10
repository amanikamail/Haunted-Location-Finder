
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

	function updateMap(address) {
		$('#map-canvas').gmap3({ action:'geoLatLng',
			callback:function (latLng) {
				if (latLng) {
					$(this).gmap3(
						{
							action:'clear'
						},
						{
							action:'setCenter',
							args:[ latLng ]
						},
						{
							action: 'addMarker',
							latLng: latLng,
							map:{
								center: true,
								zoom: 10
							}
						},
						{
							action: 'addMarker',
							address: address,
							map:{
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
		getLocationDetails();

		$('#map-canvas').gmap3({ action:'geoLatLng',
			callback:function (latLng) {
				if (latLng) {
					$(this).gmap3({action:'setCenter', args:[ latLng ]},
						{ action: 'addMarker',
						latLng: latLng,
						map:{
							center: true,
							zoom: 10
						}});
				} else {
					alert('not localised !');
				}
			}
		});


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

					updateMap(address);
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

	
