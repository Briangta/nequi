<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Allow-Origin: *");

class Qr extends CI_Controller {

	public function loadAllQrs()
	{	        	
		$response = $this->MyModel->loadAllQrs($_REQUEST);
		json_output("200",$response);		
	}

	public function setScore()
	{	        	
		$response = $this->MyModel->setScore($_REQUEST);
		json_output("200",$response);		
	}
	
}
