<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MyModel extends CI_Model {  

    public function loadAllQrs($datos)
    {
        $datosObjeto=(object)$datos;
        //$q  =$this->db->where($datos)->from('')->get();
        $q=$this->db->query("SELECT
                *
            FROM
                qr
            WHERE
                IdQr NOT IN (
                    SELECT
                        IdQr
                    FROM
                        qrusuario
                    WHERE
                        IdUsuario=$datosObjeto->idUsuario
                )");

        
        

        if ($q->num_rows()>0)
        {
            $m=$this->db->from('Usuario')->where('IdUsuario',$datosObjeto->idUsuario)->get()->row();
            return array('status' => true,'lista'=>$q->result(),'usuario'=>$m);
        }  

        return array('status' => false);   
    }

    public function getPhotos($datos){
        $datosObjeto=(object)$datos;
        $limit=0;
        if(isset($datosObjeto->limit)){
            $limit=$datosObjeto->limit;
             
            unset($datosObjeto->limit);
        }        

        $datos=(array)$datosObjeto;

        if($limit>0){
            $q  = $this->db->select('*')->from("photo")->where($datos)->limit($limit)->get();
        }else{
            $q  = $this->db->select('*')->from("photo")->where($datos)->get();
        }

        if ($q->num_rows()>0)
        { 
            foreach ($q->result() as $row)
            {
                $row->user=$this->db->select("*")->from("users")->where("objectId",$row->user)->get()->row();
            }

            return array('status' => true,"photos"=>($q->result()));
        }

        return array('status' => false);        
    }

    public function searchAnimalWithCity($datos){
        $datosObjeto=(object)$datos;
        $limit=0;
        if(isset($datosObjeto->limit)){
            $limit=$datosObjeto->limit;
             
            unset($datosObjeto->limit);
        }        

        $datos=(array)$datosObjeto;

        if($limit>0){
            $q  = $this->db->select('*')->from("photo")->like("city", $datos["city"])->limit($limit)->get();
        }else{
            $q  = $this->db->select('*')->from("photo")->like("city", $datos["city"])->get();
        }

        if ($q->num_rows()>0)
        { 
            foreach ($q->result() as $row)
            {
                $row->user=$this->db->select("*")->from("users")->where("objectId",$row->user)->get()->row();
            }

            return array('status' => true,"photos"=>($q->result()));
        }

        return array('status' => false);        
    }

    public function getPhotosFromFollows($datos){
        $datosObjeto=(object)$datos;
        $comando="SELECT
            photo.*
        FROM
            activity
        INNER JOIN users ON activity.toUser = users.objectId
        INNER JOIN photo ON photo.`user` = users.objectId
        WHERE
            activity.type = 'follow'
        AND activity.fromUser =$datosObjeto->userId
        UNION
        SELECT
            *
        FROM
            photo
        WHERE
            user =$datosObjeto->userId
            ORDER BY
		createdAt DESC";

        if(isset($datosObjeto->limit)){
            $comando.=" LIMIT $datosObjeto->limit";
        }

        $q  = $this->db->query($comando);

        if ($q->num_rows()>0)
        {    
            foreach ($q->result() as $row)
            {
                $row->user=$this->db->select("*")->from("users")->where("objectId",$row->user)->get()->row();
            }
            return array('status' => true,"photos"=>($q->result()));
        }

        return array('status' => false);        
    }

    public function getHashTags($datos){

        $q  = $this->db->select('*')->from("hasTag")->
        where($datos)->order_by("createdAt", "asc")->get();
        if ($q->num_rows()>0)
        { 
            return array('status' => true,"hasTag"=>($q->result()));
        }

        return array('status' => false);

        
    }

    public function updateData($datos){
        $objectId=$datos["objectId"];
        $tabla=$datos["tabla"];

        if($tabla=="users"){
            if(isset($datos["profilePictureMedium"])){
                $datos["profilePictureMedium"]=$this->MyModel->getImagePath($datos["profilePictureMedium"]);            
                $datos["profilePictureSmall"]=$this->MyModel->getImagePath($datos["profilePictureSmall"]);
            }
        }

        unset($datos["objectId"]);
        unset($datos["tabla"]);

        $this->db->where("objectId",$objectId)->set($datos)->update($tabla);

        return array('status' => true);
    }

    public function getOnlyRow($datos){
        $tabla=$datos["tabla"];
        unset($datos["tabla"]);

        $q  = $this->db->select('*')->where($datos)->from($tabla)->get()->row();
        if ($q!="")
        { 
            $resultado=$q;
            if(isset($resultado->user))
                $resultado->user=$this->db->where("objectId",$resultado->user)->select("*")->from("users")->get()->row();
            if(isset($resultado->animalsSaw)){
                
                $animalsSaw=explode(',',$resultado->animalsSaw);
                $rowR=$this->db->where_in("objectId",$animalsSaw)->select('*')->from("photo")->get()->result();

                foreach ($rowR as $row)
                {
                    $row->user=$this->db->select("*")->from("users")->where("objectId",$row->user)->get()->row();
                }

                $resultado->animalsSaw=$rowR;
            }
                
            return array('status' => true,"row"=>$resultado);
        }

        return array('status' => false);
    }

    

    public function deleteOnlyRow($datos)
    {
        $q  = $this->db->where("objectId",$datos["objectId"])->select('*')->delete($datos["tabla"]);
        return array('status' => true);
    }

    function getImagePath($base64)
    {
        
        $ruta="imagenes/".date("Y-m-d-H-i-s").rand(1,5000).".jpeg";
        
        $data=base64_decode($base64);
        $imagen=imagecreatefromstring($data);
        imagejpeg($imagen,$ruta,100);
        
        return "http://23.254.161.65/selva/".$ruta;
    }

    public function addOnlyRow($datos)
    {
        $tabla=$datos["tabla"];
        unset($datos["tabla"]);

        if($tabla=="photo"){
            
            $datos["image"]=$this->MyModel->getImagePath($datos["image"]);            
            $datos["thumbnail"]=$this->MyModel->getImagePath($datos["thumbnail"]);
        }

        if(isset($datos["tags"])){
            $tags="";
            if(str_replace(" ","",trim($datos["tags"]))!=""){
                $tagsA=explode("#",trim($datos["tags"]));

                foreach($tagsA as $key) {
                    if(trim($key)!=""){
                        $key=trim($key);

                        $q=$this->db->select("*")->from("hashtag")->where("topic",$key)->get()->row();
                        if($q!=""){
                            if($tags!="")
                                $tags.=",";
                            
                            $tags.=$q->objectId;

                        }else{
                            $tag=array(
                                "topic"=>$key,
                                "ACL"=>$key,
                                "createdAt"=>date_create('now')->format('Y-m-d H:i:s'),
                                "updatedAt"=>date_create('now')->format('Y-m-d H:i:s')
                            );

                            $this->db->insert("hashtag",$tag);
                            $q=$this->db->select("*")->from("hashtag")->where("topic",$key)->get()->row();
                            if($tags!="")
                                $tags.=",";
                            
                            $tags.=$q->objectId;
                        }
                    }
                }
            }

            $datos["tags"]=$tags; 
        }
        

        $parametrosObj=(object)$datos;
        $parametrosObj->createdAt=date("Y-m-d H:i:s");
        $datos=(array)$parametrosObj;

        $this->db->insert($tabla,$datos);
        $this->db->trans_commit();
        return array('status' => true);
    }

    public function getActivities($datos){
        $limit=0;

        if(!isset($datos["sql"])){
            if(isset($datos["limit"])){
                $limit=$datos["limit"];
                unset($datos["limit"]);
            }

            $this->db->select('*')->from("activity")->where($datos)->order_by("createdAt", "asc");
            if($limit>0)
                $this->db->limit($limit);

            $q  = $this->db->get();
        }else{
            
            $q=$this->db->query($datos["sql"]);
        }

        

        if ($q->num_rows()>0)
        { 
            foreach ($q->result() as $row)
            {
                $row->fromUser=$this->db->select("*")->from("users")->where("objectId",$row->fromUser)->get()->row();
                $row->toUser=$this->db->select("*")->from("users")->where("objectId",$row->toUser)->get()->row();
                $row->photo=$this->db->select("*")->from("photo")->where("objectId",$row->photo)->get()->row();
                if($row->photo!="")
                    $row->photo->user=$this->db->select("*")->from("users")->where("objectId",$row->photo->user)->get()->row();
            }
            return array('status' => true,"activities"=>($q->result()));
        }
        
        return array('status' => false);
    }


    public function manageActivities($datos)
    {
        $tipo=$datos["tipo"];

        //Eliminar todos
        if($tipo==1){
            
        }
        switch($tipo){
            case 1:
            //Eliminar
                $arregloIn=explode(",",$datos["toUser"]);
                $this->db->where("fromUser",$datos["fromUser"])->where("type",$datos["type"])->
                where_in("toUser",$arregloIn)->delete('activity');
            break;
            case 2:
            //Crear
                $arregloIn=explode(",",$datos["toUser"]);
                foreach($arregloIn as &$valor){
                    $datoIndi=array(
                        "fromUser"=>$datos["fromUser"],
                        "type"=>$datos["type"],
                        "toUser"=>$arregloIn,
                        "createdAt"=>date_create('now')->format('Y-m-d H:i:s'),
                        "updatedAt"=>date_create('now')->format('Y-m-d H:i:s')
                    );

                    $this->db->insert("activity",$datoIndi);
                    $this->db->trans_commit();
                }
            break;
            case 3:
            //Crear individual
                    $datoIndi=array(
                        "fromUser"=>$datos["fromUser"],
                        "type"=>$datos["type"],
                        "toUser"=>$datos["toUser"],
                        "createdAt"=>date_create('now')->format('Y-m-d H:i:s'),
                        "updatedAt"=>date_create('now')->format('Y-m-d H:i:s'),
                        "content"=>$datos["content"],
                        "photo"=>$datos["photo"]
                    );

                    $this->db->insert("activity",$datoIndi);
                    $this->db->trans_commit();
                
            break;
        }

        return array('status' => true);
    }

    public function countActivity($datos)
    {
        $q  = $this->db->select('count(*) as count')->from('activity')->
        where($datos)->get()->row();
       
        if($q == ""){
            return array('status' => false);
        } else {
            return array('status' => true,'count'=>$q->count);
        }
    }

    public function countPhotos($datos)
    {
        $q  = $this->db->select('count(*) as count')->from('photo')->
        where($datos)->get()->row();
       
        if($q == ""){
            return array('status' => false);
        } else {
            return array('status' => true,'count'=>$q->count);
        }
    }


}
