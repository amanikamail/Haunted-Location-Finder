<!DOCTYPE html>

<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!-->
<html lang="en"> <!--<![endif]-->


<head>

	<?php
	$this->load->view('meta');
	?>

</head>


<body class="<?php echo $filename ?>" accesskey="">
<?php
$this->load->view('header');
$this->load->view($page);
$this->load->view('footer');
?>

<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>

<script src="<?php echo base_url();?>assets/js/libs/app.js"></script>

<script src="<?php echo base_url();?>assets/js/jquery.cookie.js"></script>
<script type="text/javascript" src="/assets/js/superfish-min.js"></script>


<?php if ((isset($filename) && ($filename == 'locations' || $filename == 'addlocation'))) {
	?>
<script src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script src="/assets/js/gmap3.js"></script>

	<?
}
?>

<script src="<?php echo base_url();?>assets/js/app.js"></script>


</body>


</html>