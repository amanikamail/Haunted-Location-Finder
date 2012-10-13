
<div id="content" class="row">

	<div class="eight columns">

		<div id="map-canvas" style="height: 250px; width: 100%"></div>
		<div id="map-directions"></div>

	</div>

	<div class="four columns">

		<form id="update" class="nice" action="/client/getLocation">
			<fieldset><label>Pick A Location</label>
				<select id="address" name="address">
					<option value="">None</option>
				</select>
				<button id="submit" value="submit">Button</button>
			</fieldset>
		</form>

	</div>

</div>

	<div id="locationinfo" class="row">
		<div class="twelve columns">
			<h1></h1>
			<h3></h3>
			<p></p>
		</div>
	</div>
