<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Location_model extends CI_Model {

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

	function updateLocation($idlocation, $locationname, $locationstreet, $locationcity, $locationstate, $locationzip, $locationdescription, $uid)
	{
		if ($idlocation  == '') {
			$data = array(
				'idlocation'		=> uniqid(rand()),
				'location_name'			=> $locationname,
				'location_street'	=> $locationstreet,
				'location_city'     => $locationcity,
				'location_state'    => $locationstate,
				'location_zip'      => $locationzip,
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
		$this->db->delete( 'location' );
	}


}