<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Location_model extends CI_Model {

	function __construct() {
	}

	# Spherical Law of Cosines
	function distance_slc($lat1, $lon1, $lat2, $lon2) {
		$earth_radius = 3960.00; # in miles
		$delta_lat = $lat2 - $lat1;
		$delta_lon = $lon2 - $lon1;
		$alpha    = $delta_lat/2;
		$beta     = $delta_lon/2;
		$a        = sin(deg2rad($alpha)) * sin(deg2rad($alpha)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin(deg2rad($beta)) * sin(deg2rad($beta)) ;
		$c        = asin(min(1, sqrt($a)));
		$distance = 2*$earth_radius * $c;
		$distance = round($distance, 4);

		return $distance;
	}

	function getAjaxClosestLocations($latlng, $originlat, $originlng, $tag) {

		$pieces = explode(',', $latlng);

		$array = array(
			'tags' => $tag,
		);

		$this->db->select('*')->from('locations')->like($array);

		$location = $this->db->get();


		foreach ($location->result_array() as $address) {

//			$distance = distance_slc($originlat, $originlng, $address['lat'], $address['lng']);
			$test = $originlat . $originlng . $address['lat'] . $address['lng'];
			var_dump($test);

		}

//		echo json_encode($location->result_array());
	}

	function getAjaxLocationList()
	{
		$this->db->select( '*' )
			->from( 'locations' );

		$query = $this->db->get();

		$row = $query->row_array();
		$num = $query->num_rows();

		if ( $num < 1 ) {
			return NULL;
		}
		else {
			echo json_encode( $query->result_array() );

		}

	}

	function getAjaxLocation($idlocation)
	{
		$this->db->select( '*' )
			->from( 'locations' )
			->where( 'idlocation', $idlocation);

		$query = $this->db->get();

		$row = $query->row_array();
		$num = $query->num_rows();

		if ( $num < 1 ) {
			return NULL;
		}
		else {
			echo json_encode( $query->result_array() );

		}

	}

	function updateLocation($idlocation, $locationname, $locationstreet, $locationcity, $locationstate, $locationzip, $locationdescription, $lat, $lng, $tags, $uid)
	{
		if ($idlocation  == '') {
			$data = array(
				'idlocation'		=> uniqid(rand()),
				'location_name'			=> $locationname,
				'location_street'	=> $locationstreet,
				'location_city'     => $locationcity,
				'location_state'    => $locationstate,
				'location_zip'      => $locationzip,
				'lat'               => $lat,
				'lng'               => $lng,
				'tags'              => $tags,
				'description'       => $locationdescription,
				'userid'			=> $uid
			);
		} else {
			$data = array(
				'idlocation'		=> $idlocation,
				'location_name'		=> $locationname,
				'location_street'	=> $locationstreet,
				'location_city'     => $locationcity,
				'location_state'    => $locationstate,
				'location_zip'      => $locationzip,
				'lat'               => $lat,
				'lng'               => $lng,
				'tags'              => $tags,
				'description'       => $locationdescription,
				'userid'			=> $uid
			);
		}

		$this->db->select('*')
			->from('locations')
			->where('userid', $uid)
			->where('idlocation', $idlocation);

		$query = $this->db->get();

		$row = $query->row_array();
		$num = $query->num_rows();

		if ($num < 1)
		{
			$this->db->insert('locations', $data);

		} else {
			$this->db->where('idlocation', $idlocation);
			$this->db->update('locations', $data);
		}
	}

	function deleteLocation($id)
	{
		$this->db->where( 'idlocation', $id );
		$this->db->delete( 'locations' );
	}


}