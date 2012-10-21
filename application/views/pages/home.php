<div id="content" class="row" >

	<?php if ($filename == 'index') {
	?>

	<div class="row">
		<div class="twelve columns">
			<div id="slides" class="clearfix">

				<div class="twelve columns slide clearfix">
					<img src="/assets/images/slides/paranormal-activity-3-movie-image-slice.jpg">
					<div class="text three columns"><p>Find haunted locations near you</p></div>
				</div>

				<div class="twelve columns slide clearfix">
					<img src="/assets/images/slides/4901.jpg">
					<div class="text three columns"><p>Find haunted locations near you</p></div>
				</div>

			</div>
		</div>
	</div>

	<?php
}   ?>

    <div class="eight columns">



	    <?php

	        echo '<h2>' . $page_content->page_headline . '</h2>';

	        echo $page_content->page_content;

	        ?>

    </div>
    <div class="four columns">
        <?php $this->load->view($sidebar); ?>
    </div>

</div>