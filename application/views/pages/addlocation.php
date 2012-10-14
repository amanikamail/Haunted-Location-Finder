<div id="content">
	<div class="row">
		<div class="twelve columns">
			<h4>Haunted Locations</h4>

			<div id="map-canvas"></div>

			<?php $attributes = array('class' => 'nice', 'id' => 'locationForm');
			echo form_open('', $attributes);
			?>

			<input type="hidden" name="locationid" value=""/>
			<input type="hidden" name="userid" value="<?= $user_id;?>"/>
			<input type="hidden" name="tbxlat" id="tbxlat" >
			<input type="hidden" name="tbxlng" id="tbxlng">


			<?=form_fieldset('');?>
			<div class="row">
				<div class="twelve columns">
					<div class="six columns">
						<?=form_label('Location Name', 'location_name');?>
						<input type="text" name="location_name" id="location_name" class="input-text" placeholder="Location Name"
						       value="">

					</div>
					<div class="six columns"></div>
				</div>
			</div>

			<div class="row">
				<div class="twelve columns">
					<?=form_label('Street Address', 'location_street');?>
					<input type="text" name="location_street" id="location_street" class="input-text" placeholder="Street Address"
					       value="">

				</div>
			</div>
			<div class="row">
				<div class="twelve columns">
					<div class="six columns">
						<?=form_label('City', 'location_city');?>
						<input type="text" name="location_city" id="location_city" class="input-text" placeholder="City"
						       value="">

					</div>
					<div class="three columns">
						<?=form_label('State', 'location_state');?>
						<input type="text" name="location_state" id="location_state" class="small input-text" placeholder="State"
						       value="">

					</div>
					<div class="three columns">
						<?=form_label('Zip', 'location_zip');?>
						<input type="text" name="location_zip" id="location_zip" class="small input-text" placeholder="Zip"
						       value="">

					</div>
				</div>
			</div>
			<div class="row">
				<div class="twelve columns">
					<textarea name="location_description" id="locationeditor"></textarea>
					<?php echo display_ckeditor($ckeditor2); ?>
					<input type="hidden" name="userid" value="<?= $user_id;?>"/>
				</div>
			</div>
			<div class="row">
				<div class="twelve columns">
					<label for="tags">Enter Tags to Describe This Location</label>
					<input name="tags" id="tags" value="" />
				</div>
			</div>
			<div class="row">
				<div class="twelve columns">
					<?= form_submit('mysubmit', 'Submit Updates!'); ?>
				</div>
			</div>
			<?= form_fieldset_close();?>
			<?= form_close()?>
		</div>
	</div>
</div>