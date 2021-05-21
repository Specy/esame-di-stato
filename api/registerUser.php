<?php
error_reporting(0); 
class Response{

        var $status;
        var $content;
        function __construct($status, $content){
            $this->status = $status;
            $this->content = $content;
        }
        function encode(){
            return json_encode($this);
        }
        function send(){
            echo $this->encode();
            exit();
        }
    }
    $jsonData = json_decode(file_get_contents('php://input'));
    $mysqli = mysqli_connect("localhost", "root", "", "my_specy");

    $existsUser = 'SELECT `IDUtente` FROM `utenti` where `email` = ?';
    if($stmt = $mysqli->prepare($existsUser)){
        $stmt->bind_param('s',$jsonData->email);
        $stmt->execute();
        if($stmt->fetch() !== NULL){
            (new Response('error','Utente con questa mail esiste gia'))->send();
        }
        $stmt->close();
    }

    $query = 'INSERT INTO `utenti`(`nome`,`cognome`,`via`,`telefono`,`email`,`password`)
            VALUES (?,?,?,?,?,?)';
    if($stmt = $mysqli->prepare($query)){
        $stmt->bind_param("ssssss",$jsonData->name,
                                    $jsonData->surname,
                                    $jsonData->address,
                                    $jsonData->phoneNumber,
                                    $jsonData->email,
                                    password_hash($jsonData->password,PASSWORD_DEFAULT));
        $stmt->execute();
        $stmt->close();
    }else{
        (new Response('error','error adding restaurant'))->send();
    }
    (new Response('success','user registered'))->send();
?>