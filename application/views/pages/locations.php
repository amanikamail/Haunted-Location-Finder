
<div id="content" class="row">

	<div class="twelve columns">

		<script type="text/javascript">

			$(document).ready(function() {

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
			});

		</script>

		<div id="map_canvas" style="width:500px;height:250px"></div>

	</div>

</div>
