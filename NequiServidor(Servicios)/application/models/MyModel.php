<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MyModel extends CI_Model {  

    public function loadAllQrs($datos)
    {
        $datosObjeto=(object)$datos;
        //$q  =$this->db->where($datos)->from('')->get();
        $q=$this->db->from('PuntosNequi')->get();

        
        

        if ($q->num_rows()>0)
        {
            $m=$this->db->from('Usuario')->where('IdUsuario',$datosObjeto->idUsuario)->get()->row();
            return array('status' => true,'lista'=>$q->result(),'usuario'=>$m);
        }  

        return array('status' => false);   
    }

    public function setScore($datos){
        $score=$this->db->select('Puntos')->from("Usuario")->where("IdUsuario",$datos["IdUsuario"])->get()->row();
        $score=(int)$score->Puntos+$datos["score"];        
        $this->db->where("IdUsuario",$datos["IdUsuario"])->set("Puntos",$score)->update("Usuario");
        return array('status' => true,'lista'=>$score);
    }



}
