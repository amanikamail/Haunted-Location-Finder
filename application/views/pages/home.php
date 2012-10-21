<div id="content" class="row" >

	<?php if ($filename == 'index') {
	?>

	<?php
}   ?>

    <div class="eight columns">
	    <div class="row">
		    <div class="twelve columns hide-for-small">
			    <div id="slides" class="clearfix" style="height:200px;">

				    <div class="slide clearfix">
					    <img src="/assets/images/slides/paranormal-activity-3-movie-image-slice.jpg">
					    <div class="text three columns"><p>Find haunted locations near you</p></div>
				    </div>

				    <div class="slide clearfix">
					    <img src="/assets/images/slides/4901.jpg">
					    <div class="text three columns"><p>Find haunted locations near you</p></div>
				    </div>

			    </div>
		    </div>
		    <div class="twelve columns show-for-small">
			    <div class="slide clearfix">
				    <img src="/assets/images/slides/paranormal-activity-3-movie-image-slice.jpg">
				    <div class="text three columns"><p>Find haunted locations near you</p></div>
			    </div>
		    </div>
	    </div>


	    <?php

	        echo '<h2>' . $page_content->page_headline . '</h2>';

	        echo $page_content->page_content;

	        ?>

    </div>
    <div class="four columns">
        <?php $this->load->view($sidebar); ?>
    </div>

</div>