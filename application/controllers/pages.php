<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
	/**
	 * Created by IntelliJ IDEA.
	 * User: OpenSkyMedia
	 * Date: 1/25/12
	 * Time: 5:50 PM
	 */
	class Pages extends CI_Controller
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->helper('ckeditor');
			$this->load->library('ion_auth');
			$this->load->library('Treeview');
			$this->load->model('Pages_model');
			$this->siteid = $this->domain_model->getUID();
			$siteid = $this->domain_model->getUID();

			if (!$this->ion_auth->logged_in()) {
				$this->login     = 'false';
				$this->user_id   = '';
				$this->user_name = '';
			} else {
				$user            = $this->ion_auth->user()->row();
				$this->user_id   = $user->id;
				$this->user_name = $user->username;
				$this->login     = 'true';
			}
		}

		public function index($sectionid = 1, $pageid = 1)
		{

			$filename = strtolower($this->Pages_model->getPageName($pageid));
			$data['filename'] = $filename;
			if (@file_exists(APPPATH."views/pages/{$filename}.php"))
			{
				if ($filename == 'addlocation') {
					$data['ckeditor2'] = array(

						//ID of the textarea that will be replaced
						'id'      => 'locationeditor',
						'path'    => 'assets/js/ckeditor',

						//Optionnal values
						'config'  => array(
							// 'toolbar'     => "Basic", //Using the Full toolbar
							'toolbar'		=> array(
								array('Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates'),
								array('Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink','-','About'),
								array('Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe')
							),
							'width'       => "550px", //Setting a custom width
							'height'      => '500px', //Setting a custom height

						),

						//Replacing styles from the "Styles tool"
						'styles'  => array(

							//Creating a new style named "style 1"
							'style 1' => array(
								'name'         => 'Blue Title',
								'element'      => 'h2',
								'styles'       => array(
									'color'               => 'Blue',
									'font-weight'         => 'bold'
								)
							)
						)
					);
				}

				$data['page']          = 'pages/' . $filename;
			} else {
				$data['page']          = 'pages/home';
			}

			$data['login']         = $this->login;
			$data['user_id']       = $this->user_id;
			$data['username']      = $this->user_name;
			$data['navigation']     = $this->treeview->buildmenu();
			$data['pagelist']      = $this->Pages_model->getPageList($this->siteid);
			$data['page_title']    = $this->domain_model->getSiteTitle($this->siteid);
			$data['page_desc']     = $this->domain_model->getPageMetaDesc($this->siteid);
			$data['page_keywords'] = $this->domain_model->getPageMetaKeywords($this->siteid);
			$data['page_content']  = $this->Pages_model->getPageContent($this->siteid, $sectionid, $pageid);
			$data['sidebar']       = 'sidebars/home-sidebar';

			$this->load->view('container', $data);
		}

		public function getPageList() {
			$this->Pages_model->getAjaxSidebarPageList($this->siteid);
	}


	}
